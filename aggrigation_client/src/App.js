import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SourceProvider } from '../src/contexts/SourceContext';
import Navbar from './Screening/Component/Admin/Navbar';
import Sidebar from './Screening/Component/Admin/Sidebar';
import Footer from './Screening/Component/Admin/Footer';
import NotFoundImage from './Screening/Component/Admin/NotFoundImage';
import Vital from './Screening/Component/Admin/Screening/StartScreening/Vitals/Vital';
import HealthList from './Screening/Component/Admin/Healthcard/List/HealthList';
import Childvital from './Screening/Component/Admin/Screening/StartScreening/Vitals/ChildVital';
import FamilyInfo from './Screening/Component/Admin/Screening/StartScreening/Vitals/FamilyInfo';
import Treatment from './Screening/Component/Admin/Screening/StartScreening/Vitals/BasiScreen/Treatment';
import Report from './Screening/Component/Admin/Report/Report';
import './App.css'
import Desk from './Screening/Component/Followup/Desk';
import ViewFollowup from './Screening/Component/Followup/FolloupForms/ViewFollowup';
import AddFollowUp from './Screening/Component/Followup/FolloupForms/AddFollowUp';
import DentalAssesment from './Screening/Component/Admin/Screening/StartScreening/Vitals/AI/DentalAssesment';
import Other from './Screening/Component/Admin/Screening/StartScreening/Vitals/Other';
//________________________________________Routing_______________________________________//
const Citizenlist = lazy(() => import('./Screening/Component/Admin/Addcitizen/List/Citizenlist'));
const Header = lazy(() => import('./Screening/Component/Admin/Addcitizen/Citizenforms/Citizennav/Header'));
const AddUser = lazy(() => import('./Screening/Component/Admin/SystemUser/AddUser'));
const ScheduleScreening = lazy(() => import('./Screening/Component/Admin/Schedule/ScheduleScreening'));
const AddSource = lazy(() => import('./Screening/Component/Admin/Source/AddSource'));
const ScreeningList = lazy(() => import('./Screening/Component/Admin/Screening/List/ScreeningList'));
const Body = lazy(() => import('./Screening/Component/Admin/Screening/StartScreening/HumanAnatomy/Body'));
const BmiVital = lazy(() => import('./Screening/Component/Admin/Screening/StartScreening/Vitals/BmiVital'));
const Permission = lazy(() => import('./Screening/Component/Admin/Permission/Permission'));
const Login = lazy(() => import('./Screening/Component/Admin/Login/Login'));
const Viewcitizen = lazy(() => import('./Screening/Component/Admin/Addcitizen/List/Viewcitizen'));
const Updatecitizen = lazy(() => import('./Screening/Component/Admin/Addcitizen/List/Updatecitizen'));

const Main = lazy(() => import('./Screening/Component/Admin/Main'));

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') ? localStorage.getItem('isLoggedIn') === 'true' : false
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // useEffect(() => {
  //   const googleTranslateElementInit = () => {
  //     new window.google.translate.TranslateElement(
  //       {
  //         pageLanguage: 'en',
  //         autoDisplay: false,
  //       },
  //       'google_translate_element'
  //     );
  //   };

  //   const addScript = document.createElement('script');
  //   addScript.setAttribute(
  //     'src',
  //     '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  //   );

  //   addScript.addEventListener('error', (error) => {
  //     console.error('Error loading Google Translate script:', error);
  //   });

  //   document.body.appendChild(addScript);
  //   window.googleTranslateElementInit = googleTranslateElementInit;

  //   return () => {
  //     // Cleanup script when component unmounts
  //     document.body.removeChild(addScript);
  //     delete window.googleTranslateElementInit;
  //   };
  // }, []);

  return (
    <div>
      <BrowserRouter basename="">
        {isLoggedIn &&
          <Navbar className="Navbarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr custom-margin" onLogout={handleLogout} />
        }
        {isLoggedIn &&
          <div className="sidebarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr custom-margin">
            <Sidebar />
          </div>
        }
        <div className="content-container cvfghfyrn">
          <Suspense fallback={<div>Loading...</div>}>
            <SourceProvider>
              <Routes>
                <Route path="/screening/dental_assesment" element={<DentalAssesment />} />
                <Route path="/" element={<Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
                <Route path="/mainscreen/Dashboard" element={<Main />} />
                <Route path="/mainscreen/Citizen" element={<Citizenlist />} />
                <Route path="/mainscreen/Citizenheader" element={< Header />} />
                <Route path="/mainscreen/System User" element={<AddUser />} />
                <Route path="/mainscreen/Schedule Screening" element={<ScheduleScreening />} />
                <Route path="/mainscreen/Screening" element={<ScreeningList />} />
                <Route path="/mainscreen/Source" element={<AddSource />} />
                <Route path="/mainscreen/Report" element={<Report />} />
                <Route path="/mainscreen/Healthcard" element={<HealthList />} />
                <Route path="/mainscreen/body" element={<Body />} />
                <Route path="/mainscreen/body/bmivital" element={<BmiVital />} />
                <Route path="/mainscreen/body/vital" element={<Vital />} />
                <Route path="/vital/childInfo" element={<Childvital />} />
                <Route path="/vital/familiInfo" element={<FamilyInfo />} />
                <Route path="/mainscreen/updatecitizen/:id/:sourceId" element={<Updatecitizen />} />
                <Route path="/mainscreen/viewcitizen/:id/:sourceId" element={<Viewcitizen />} />

                <Route path="****" element={<NotFoundImage />} />
                <Route path="/mainscreen/Permission" element={<Permission />} />

                <Route path="/treatment" element={<Treatment />} />
                <Route path='/mainscreen/Follow-Up' element={<Desk />} />
                {/* <Route path='/mainscreen/Follow-Up/viewFollowup/:id' element={<ViewFollowup />} /> */}
                <Route path='/mainscreen/Follow-Up/viewFollowup/:citizenId/' element={<ViewFollowup />} />
                <Route path='/mainscreen/Follow-Up/addFollowup/:citizenId/:scheduleId/:pkId' element={<AddFollowUp />} />
                <Route path='/mainscreen/Follow-Up/addFollowup/:citizenId/:scheduleId/:pkId' element={<AddFollowUp />} />
                <Route path="/other" element={<Other />} />
              </Routes>
            </SourceProvider>
          </Suspense>
        </div>
        {isLoggedIn && <Footer />}

      </BrowserRouter>
    </div>
  )
}

export default App