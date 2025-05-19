import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';

function MainTemplate(props) {
    const { children, footerCourseName, footerCourseLink, navItems, logo } = props;

    return (
        <div className="layout">
            <Header logo={logo} navItems={navItems} />
            <main className="my-5">
                {children}
            </main>
            <Footer courseName={footerCourseName} courseLink={footerCourseLink} navItems={navItems} />
        </div>
    );
};

export default MainTemplate;