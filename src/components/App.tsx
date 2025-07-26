import { Header } from './Header.tsx'
import { Schedule } from './Schedule.tsx'
import { Footer } from './Footer.tsx'
import { useState } from 'react'

function App() {
	const [currentPage, setNewPage] = useState<'schedule'>('schedule')

  return (
  	<>
    	<div className="app">
    	  <main id='app'>
    	    <Header newPage={setNewPage}/>
    	    {currentPage == "schedule" && <Schedule/>}
    	    <Footer/>
    	  </main>
    	</div>
  	</>
  )
}

export default App