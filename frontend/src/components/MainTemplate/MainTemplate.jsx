import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import { Auth0Provider } from "@auth0/auth0-react";

function MainTemplate(props) {
    const { children, footerCourseName, footerCourseLink, navItems, logo } = props;

    return (
        <div>
            <Header logo={logo} navItems={navItems} />
            <div className="my-5">
                {children}
            </div>
            <Footer courseName={footerCourseName} courseLink={footerCourseLink} navItems={navItems} />
        </div>
    );
}

export default MainTemplate;