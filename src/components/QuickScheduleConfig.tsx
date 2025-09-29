import '../styles/Config.css'
import { useEffect, useRef, useState } from 'react'

function QuickScheduleConfig() {
  const selectGroup = useRef<HTMLSelectElement>(null);
  const [quickScheduleReady, setQuickSchedule] = useState(false);
	const [eduGroup, setEduGroup] = useState<EduGroup>({});
  const [error, setErrorQS] = useState(true);
	interface EduGroup {[groups:string]: {array:string[]}};

  useEffect(() => {
		async function loadingSchedule() {
			try {
        const storedGroups = localStorage.getItem("groups");
        if (storedGroups) {
          const parsedGroups:EduGroup = JSON.parse(storedGroups);
          setEduGroup(parsedGroups);
        } else {
          const allEduGroups = await fetch("/api/groups");
          const groups:EduGroup = await allEduGroups.json();
          setEduGroup(groups);
          localStorage.setItem("groups", JSON.stringify(groups));
        };
			} catch (err) {
				console.error(err);
        setErrorQS(true);
			} finally {
        setErrorQS(false);
      };
		};
    if (localStorage.getItem("user_quick_schedule") == null) {
      loadingSchedule();
    } else {
      setErrorQS(false);
      setQuickSchedule(true);
    };
  }, []);
  
  function saveQuickSchedule() {
    setQuickSchedule(true);
    if (selectGroup.current) {
      localStorage.setItem("user_quick_schedule", selectGroup.current.value);
    };
  };

  if (error) {
    return (<></>)
  };

  if (!quickScheduleReady) {
    if (!eduGroup.groups) {
      return (<></>)
    };

    if (Object.keys(eduGroup.groups).length !== 0) {
      return (
        <div id='background-cfg'>
          <div id='config'>
            <h1>Быстрое расписание</h1>
            <p>Выберите Вашу учебную группу из списка ниже чтобы быстрее получать расписание:</p>
            <select ref={selectGroup}>
              {Object.entries(eduGroup.groups).map(([_index, _group]) => (
                <option>{_group}</option>
              ))}
            </select>
            <button onClick={saveQuickSchedule}>Сохранить</button>
          </div>
        </div>
      );
    } else {
      return (<></>)
    }
  } else {
    return (<></>);
  };
};

export { QuickScheduleConfig };