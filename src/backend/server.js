import cors from 'cors'
import express from 'express'
import { chromium } from 'playwright'

const app = express()
const port = 3000
const host = '0.0.0.0'

app.use(cors()); 

function getCurrentWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const weekDates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    weekDates.push(date)
  }

  return weekDates;
}

app.get('/current_date', async (req, res) => {
  const week = getCurrentWeekDates()
  res.send(
    {"current": String(week.map(d => d.toLocaleDateString("ru-ru"))[0]+" — "+week.map(d => d.toLocaleDateString("ru-ru"))[week.length-1])}
  )
})

app.get('/schedule', async (req, res) => {
  let browser = null
  let result = {}
  let index = 0

  try {
    browser = await chromium.launch({headless: true})
    const page = await browser.newPage()
    const week = getCurrentWeekDates();

    await page.goto(`https://moodle.preco.ru/blocks/sheduleonlineurk/sheduleonlinefree.php?datebegin[day]=`+week.map(d => d.getDate())[0]+`&datebegin[month]=`+week.map(d => d.getMonth()+1)[0]+`&datebegin[year]=`+week.map(d => d.getFullYear())[0]+`&datefinish[day]=`+week.map(d => d.getDate())[week.length-1]+`&datefinish[month]=`+week.map(d => d.getMonth()+1)[week.length-1]+`&datefinish[year]=`+week.map(d => d.getFullYear())[week.length-1])
    await page.waitForSelector(".select2-selection__rendered")
    await page.click(".select2-selection__rendered")
    await page.waitForSelector(".select2-search__field")
    await page.fill(".select2-search__field", req.query.group)
    await page.click(".select2-results__option")
    await page.click("#id_submitbutton")
    await page.waitForSelector(".urk_shedule", {'timeout': 500})

    let shedule = page.locator(".urk_shedule")
    let shedule_blocks = shedule.locator(".urk_sheduleblock")
    let all_lessons = await shedule_blocks.count()
    let shedule_visible = await shedule.isVisible()
    let shedule_count = await shedule.count()

    if (shedule_count > 0 && shedule_visible) {
      for (let lesson = 0; lesson < all_lessons; lesson++) {
        let lesson_block = shedule_blocks.nth(lesson)
        let lesson_date = lesson_block.locator(".urk_sheduledate")
        let dates = await lesson_date.count()

        for (let time = 0; time < dates; time++) {
          let time_lesson = lesson_date.nth(time)
          let timedate = await time_lesson.textContent()
          let target_lessons = lesson_block.locator(".urk_lessonblock")
          let count = await target_lessons.count()

          index = 0
          result[timedate] = {}
          for (let contentIdx = 0; contentIdx < count; contentIdx++) {
            index++

            let count_description = lesson_block.locator(".urk_lessondescription")
            let nth_description = count_description.nth(contentIdx)
            let result_description = await nth_description.textContent()
            let target_description = result_description.trim('\n', ' ')

            let target_lesson_date = target_lessons.locator(".urk_timewindow")
            let nth_target_lesson_date = target_lesson_date.nth(contentIdx)
            let lesson_time_coupe = nth_target_lesson_date.locator(".urk_timewindowinfo").nth(0)
            let lesson_time_start = nth_target_lesson_date.locator(".urk_timewindowinfo").nth(1)
            let lesson_time_end = nth_target_lesson_date.locator(".urk_timewindowinfo").nth(2)

            let target_time_coupe = await lesson_time_coupe.textContent()
            let target_time_start = await lesson_time_start.textContent()
            let target_time_end = await lesson_time_end.textContent()

            result[timedate][index] = {
              name: target_description,
              coupe: target_time_coupe,
              time_start: target_time_start,
              time_end: target_time_end
            };
          }
        }
      }
    }
  } catch (error) {
    console.error(
      "Schedule parser error: ", error
    )
  }

  res.json(result)
})

app.get('/groups', async (req, res) => {
  let browser = null
  let groups_dict = {'groups': {}}
  let group_arr = []

  try {
    browser = await chromium.launch({headless: true})
    const page = await browser.newPage()
    await page.goto(`https://moodle.preco.ru/blocks/sheduleonlineurk/sheduleonlinefree.php`)

    await page.waitForSelector('.select2-selection__rendered')
    await page.click('.select2-selection__rendered')
    await page.waitForSelector('.select2-results__options')
    let selection = page.locator('#select2-id_listgroups-results')
    let options = selection.locator('.select2-results__option')

    for (let element of await options.all()) {
      let content = await element.innerText()
      group_arr.push(content)
    }
  } catch (err) {
    console.error(
      "Getting all groups error: ", err
    )
  }

  groups_dict["groups"] = group_arr  
  res.json(groups_dict)
})

app.listen(port, host, () => {
  console.log(`Server start: ${host}:${port}`)
})
