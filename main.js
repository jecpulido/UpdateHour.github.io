import { toast } from 'https://cdn.skypack.dev/wc-toast'
import countries from './countries.json'

const $ = selector => document.querySelector(selector)

function changeTimeZone(date, timeZone) {
  const dateToUse = typeof date === 'string'
    ? new Date(date)
    : date

  return new Date(dateToUse.toLocaleString('en-US', {
    timeZone
  }))
}

// const spainInfo = countries.find(country => country.country_code === 'ES')
// const argInfo = countries.find(country => country.country_code === 'AR')
// const colInfo = countries.find(country => country.country_code === 'CO')

const transformDateToString = (date) => {
  const localDate = date.toLocaleString('en-US', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric'
  })

  return localDate.replace(':00', 'Hrs')
}

const $input = $('input')
const $textarea = $('textarea')
$input.addEventListener('change', () => {
  //event.preventDefault()
  //const { date } = Object.fromEntries(new FormData($form))
  const date = $input.value
  const mainDate = new Date(date)


  const times = {}
  countries.forEach(country => {
    const { country_code: code, emoji, timezones } = country
    const [ timezone ]  = timezones

    const dateInTimeZone = changeTimeZone(mainDate, timezone)
    const hour = dateInTimeZone.getHours()

    times[hour] ??= []

    times[hour].push({
      date: dateInTimeZone,
      code,
      emoji,
      timezones
    })
  })

  const sortedTimesEntries = Object 
    .entries(times)
    .sort(([timeA], [timeB]) => timeA - +timeB)
  
  const html = sortedTimesEntries.map(([,countries]) => {
    const flags = countries.map(country => `${country.emoji}`).join(' ')
    const [country] = countries
    const {date} = country
    return `${transformDateToString(date)} ${flags}`
  }).join('\n')

  console.log(html)

  //copiar en portapapeles el código
  navigator.clipboard.writeText(html)
    .then(() => {
      toast('¡Enlace copiado al portapapeles!', {
        icon: {
          type: 'success'
        }
      })
    })
  $textarea.value = html


});