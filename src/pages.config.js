/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import EventSelection from './pages/EventSelection';
import FutureJobs from './pages/FutureJobs';
import Home from './pages/Home';
import PresentationMaterial from './pages/PresentationMaterial';
import Profile from './pages/Profile';
import ResearchDocumentation from './pages/ResearchDocumentation';
import ScenarioGenerator from './pages/ScenarioGenerator';
import Scenarios from './pages/Scenarios';


export const PAGES = {
    "EventSelection": EventSelection,
    "FutureJobs": FutureJobs,
    "Home": Home,
    "PresentationMaterial": PresentationMaterial,
    "Profile": Profile,
    "ResearchDocumentation": ResearchDocumentation,
    "ScenarioGenerator": ScenarioGenerator,
    "Scenarios": Scenarios,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};