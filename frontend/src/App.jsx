import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logo from './assets/images/logo.png';
import { SavedAmiiboProvider } from './context/SavedAmiiboProvider.jsx';
import MainTemplate from './components/MainTemplate/MainTemplate.jsx';
import Home from './views/Home/Home.jsx';
import AmiiboCollection from './views/AmiiboCollection/AmiiboCollection.jsx';
import AmiiboDetail from './views/AmiiboDetail/AmiiboDetail.jsx';
import Profile from './views/Profile/Profile.jsx';
import Info from './views/Info/Info.jsx';

function App() {
    const nav = [
        { link: "/", label: "Home", exact: "true" },
        { link: "/collection", label: "Collection", exact: "false" },
        { link: "/info", label: "Info", exact: "true" }
    ];

    return (
        <BrowserRouter>
            <SavedAmiiboProvider>
                <MainTemplate
                    footerCourseName="Applicazioni Web: Progettazione e Sviluppo"
                    footerCourseLink="https://elearning.unimib.it/course/view.php?id=51512"
                    navItems={nav}
                    logo={Logo}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/collection" element={<AmiiboCollection />} />
                        <Route path="/collection/:tail" element={<AmiiboDetail />} />
                        <Route path="/collection/:type" element={<AmiiboCollection />} />
                        <Route path="/collection/:amiiboSeries" element={<AmiiboCollection />} />
                        <Route path="/info" element={<Info />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </MainTemplate>
            </SavedAmiiboProvider>
        </BrowserRouter>
    );
};

export default App;