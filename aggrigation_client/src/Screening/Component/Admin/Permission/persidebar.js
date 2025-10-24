import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import SummarizeIcon from '@mui/icons-material/Summarize';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import sperologo from '../../Images/SPERO-Final-logo png (1) 2.png'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';


const Sidebarnew = () => {

  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const [hoveredItem, setHoveredItem] = useState('');
  const [permission, setPermission] = useState([])

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  const handleItemHover = (itemName) => {
    setHoveredItem(itemName);
  };

  useEffect(() => {
    const storedPermissions = localStorage.getItem('permissions');
    console.log('Stored Permissions:', storedPermissions);
    const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
    console.log('parsedPermissions Permissions:', storedPermissions);
    setPermission(parsedPermissions);
  }, []);

  return (
    <div>
      <aside className='main-sidebar elevation-3'>
        <div className='sidebar'>
          <nav className='mt-2'>
            <ul className='nav nav-sidebar flex-column' data-widget='treeview' role='menu'>
            {
           permission.map((module, index) => {
            console.log('Module Object:', module);
            return (
              <li key={index} className={`nav-item listview ${selectedItem === module.moduleName ? 'active' : ''}`}>
                {module.modules_submodule.map((submodule, subIndex) => (
                  <Link
                    key={subIndex}
                    className={`nav-link ${hoveredItem === submodule.moduleName ? 'hovered' : ''}`}
                    id='list'
                    to='/dashboard'
                    onClick={() => handleItemClick(submodule.moduleName)}
                    onMouseEnter={() => handleItemHover(submodule.moduleName)}
                    onMouseLeave={() => handleItemHover('')}
                  >
                    <SpaceDashboardIcon className={`icons ${hoveredItem === submodule.moduleName ? 'hovered-icon' : ''}`} />
                    <p className='ptag'>{submodule.moduleName}</p>
                  </Link>
                ))}
              </li>
            );
          })
        
          }
            </ul>
          </nav>
        </div>

        <div className='sidebar-image'>
          <img className='logo' src={sperologo} />
        </div>
      </aside>
    </div>
  );
};

export default Sidebarnew;
