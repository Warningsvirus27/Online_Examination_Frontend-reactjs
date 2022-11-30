import react from 'react';


function NavItem({text, link}) {
        return <>
            <li className="nav-item">
                <a className="nav-link" href={link}>{text}</a>
            </li>
        </>
}

export default NavItem;