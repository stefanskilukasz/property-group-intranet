/**
 * Weather for a fixed office location (Open-Meteo, no API key). Ported from
 * the prototype's loadWeather()/wxMeta() — including its explicit choice
 * (see prototype comment near nextOccurrence) to use a fixed office
 * coordinate rather than the browser Geolocation API, so SPFx deployment
 * never needs a geolocation permission prompt.
 */
export const OFFICE_LOCATION = { lat: 52.1936, lon: 20.9556, name: 'Warszawa · biuro' };

export interface IWeather {
  temp: number;
  feels: number;
  max: number;
  min: number;
  code: number;
  isDay: boolean;
  place: string;
}

export interface IWeatherMeta {
  icon: string;
  label: string;
}

export function wxMeta(code: number, isDay: boolean): IWeatherMeta {
  const m = (icon: string, label: string): IWeatherMeta => ({ icon, label });
  if (code === 0) return m(isDay ? 'sun' : 'cloud', 'Bezchmurnie');
  if (code === 1 || code === 2) return m('cloudSun', 'Częściowe zachmurzenie');
  if (code === 3) return m('cloud', 'Pochmurno');
  if (code === 45 || code === 48) return m('fog', 'Mgła');
  if (code >= 51 && code <= 57) return m('rain', 'Mżawka');
  if (code >= 61 && code <= 67) return m('rain', 'Deszcz');
  if (code >= 71 && code <= 77) return m('snow', 'Śnieg');
  if (code >= 80 && code <= 82) return m('rain', 'Przelotne opady');
  if (code === 85 || code === 86) return m('snow', 'Opady śniegu');
  if (code >= 95) return m('storm', 'Burza');
  return m('cloud', 'Pogoda');
}

export async function loadWeather(): Promise<IWeather> {
  const { lat, lon, name } = OFFICE_LOCATION;
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
    '&current=temperature_2m,apparent_temperature,is_day,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1';
  const res = await fetch(url);
  const data = await res.json();
  if (!data || !data.current) {
    throw new Error('brak danych pogodowych');
  }
  return {
    temp: Math.round(data.current.temperature_2m),
    feels: Math.round(data.current.apparent_temperature),
    max: Math.round(data.daily.temperature_2m_max[0]),
    min: Math.round(data.daily.temperature_2m_min[0]),
    code: data.current.weather_code,
    isDay: data.current.is_day === 1,
    place: name
  };
}
