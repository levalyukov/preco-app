import cors from 'cors'
import express from 'express'
import { chromium } from 'playwright'

const app = express()
const port = 3000
const host = '192.168.31.143'

app.use(cors()); 

app.get('/schedule', async (req, res) => {
  let browser = null
  let result = {}
  let index = 0

  browser = await chromium.launch()
  const page = await browser.newPage()
  
  await page.goto("https://moodle.preco.ru/blocks/sheduleonlineurk/sheduleonlinefree.php?datebegin[day]=13&datebegin[month]=1&datebegin[year]=2025&datefinish[day]=18&datefinish[month]=1&datefinish[year]=2025")
  await page.waitForSelector(".select2-selection__rendered")
  await page.click(".select2-selection__rendered")
  await page.waitForSelector(".select2-search__field")
  await page.fill(".select2-search__field", '110')
  await page.click(".select2-results__option")
  await page.click("#id_submitbutton")
  await page.waitForSelector(".urk_shedule")

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
  res.json(result)
})

app.listen(port, host, () => {
  console.log(`Server start: ${host}:${port}`)
})
