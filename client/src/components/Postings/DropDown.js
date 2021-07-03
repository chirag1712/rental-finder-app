import './Postings.css';

import { useState } from 'react';

const DropDown = ({ title, options, selected, setSelected }) => {

    const [showMenu, setShowMenu] = useState(false)

    const selectOption = e => {
        let option = options[e.target.id]
        if (option === selected) setSelected(title, null)
        else setSelected(title, option)
        setShowMenu(!showMenu)
    }

    const toggleMenu = () => { setShowMenu(!showMenu) }

    return (
        <div className='dropdown'>
            <button className={`btn ${showMenu ? 'selected' : ''}`} onClick={toggleMenu}>
                {selected === null ? title : selected}
            </button>
            {showMenu &&
                <div className='dropdown-content'>
                    {
                        options.map((option, key) =>
                        (<div key={key} id={key}
                            className={selected === option ? 'selected' : null}
                            onClick={selectOption}>
                            {option}
                        </div>))
                    }
                </div>
            }
        </div>
    );
}

export default DropDown
