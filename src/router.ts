import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home/index.vue';
import Dashboard from './views/Dashboard/index.vue'

// import Dashboard from './views/Dashboard.vue';
import DashboardLayout from './components/Theme/Layout/DashboardLayout.vue';
import Overview from './components/Theme/Views/Dashboard/Overview.vue';
import Stats from './components/Theme/Views/Dashboard/Stats.vue';

// Pages
import User from './components/Theme/Views/Pages/UserProfile.vue';
import TimeLine from './components/Theme/Views/Pages/TimeLinePage.vue';
import Login from './components/Theme/Views/Pages/Login.vue';
import Register from './components/Theme/Views/Pages/Register.vue';
import Lock from './components/Theme/Views/Pages/Lock.vue';

// Components pages
import Buttons from './components/Theme/Views/Components/Buttons.vue';
import GridSystem from './components/Theme/Views/Components/GridSystem.vue';
import Panels from './components/Theme/Views/Components/Panels.vue';
import SweetAlert from './components/Theme/Views/Components/SweetAlert.vue';
import Notifications from './components/Theme/Views/Components/Notifications.vue';
import Icons from './components/Theme/Views/Components/Icons.vue';
import Typography from './components/Theme/Views/Components/Typography.vue';

// Forms pages
import RegularForms from './components/Theme/Views/Forms/RegularForms.vue';
import ExtendedForms from './components/Theme/Views/Forms/ExtendedForms.vue';
import ValidationForms from './components/Theme/Views/Forms/ValidationForms.vue';
import Wizard from './components/Theme/Views/Forms/Wizard.vue';

// TableList pages
import RegularTables from './components/Theme/Views/Tables/RegularTables.vue';
import ExtendedTables from './components/Theme/Views/Tables/ExtendedTables.vue';
import PaginatedTables from './components/Theme/Views/Tables/PaginatedTables.vue';
// Maps pages
import GoogleMaps from './components/Theme/Views/Maps/GoogleMaps.vue';
import FullScreenMap from './components/Theme/Views/Maps/FullScreenMap.vue';
import VectorMaps from './components/Theme/Views/Maps/VectorMapsPage.vue';

// Calendar
import Calendar from './components/Theme/Views/Calendar/CalendarRoute.vue';
// Charts
import Charts from './components/Theme/Views/Charts.vue';

let componentsMenu = {
  path: '/components',
  component: DashboardLayout,
  redirect: '/components/buttons',
  children: [
    {
      path: 'buttons',
      name: 'Buttons',
      component: Buttons
    },
    {
      path: 'grid-system',
      name: 'Grid System',
      component: GridSystem
    },
    {
      path: 'panels',
      name: 'Panels',
      component: Panels
    },
    {
      path: 'sweet-alert',
      name: 'Sweet Alert',
      component: SweetAlert
    },
    {
      path: 'notifications',
      name: 'Notifications',
      component: Notifications
    },
    {
      path: 'icons',
      name: 'Icons',
      component: Icons
    },
    {
      path: 'typography',
      name: 'Typography',
      component: Typography
    }

  ]
};
let formsMenu = {
  path: '/forms',
  component: DashboardLayout,
  redirect: '/forms/regular',
  children: [
    {
      path: 'regular',
      name: 'Regular Forms',
      component: RegularForms
    },
    {
      path: 'extended',
      name: 'Extended Forms',
      component: ExtendedForms
    },
    {
      path: 'validation',
      name: 'Validation Forms',
      component: ValidationForms
    },
    {
      path: 'wizard',
      name: 'Wizard',
      component: Wizard
    }
  ]
};

let tablesMenu = {
  path: '/table-list',
  component: DashboardLayout,
  redirect: '/table-list/regular',
  children: [
    {
      path: 'regular',
      name: 'Regular Tables',
      component: RegularTables
    },
    {
      path: 'extended',
      name: 'Extended Tables',
      component: ExtendedTables
    },
    {
      path: 'paginated',
      name: 'Paginated Tables',
      component: PaginatedTables
    }]
};

let mapsMenu = {
  path: '/maps',
  component: DashboardLayout,
  redirect: '/maps/google',
  children: [
    {
      path: 'google',
      name: 'Google Maps',
      component: GoogleMaps
    },
    {
      path: 'full-screen',
      name: 'Full Screen Map',
      component: FullScreenMap
    },
    {
      path: 'vector-map',
      name: 'Vector Map',
      component: VectorMaps
    }
  ]
};

let pagesMenu = {
  path: '/pages',
  component: DashboardLayout,
  redirect: '/pages/user',
  children: [
    {
      path: 'user',
      name: 'User Page',
      component: User
    },
    {
      path: 'timeline',
      name: 'Timeline Page',
      component: TimeLine
    }
  ]
};

let loginPage = {
  path: '/login',
  name: 'Login',
  component: Login
};

let registerPage = {
  path: '/register',
  name: 'Register',
  component: Register
};

let lockPage = {
  path: '/lock',
  name: 'Lock',
  component: Lock
};

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('loggedIn') === 'true') {
            next({
                path: '/dashboard'
            })
        } else {
            next()
        }
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import (/* webpackChunkName: "about" */ './views/About.vue'),
    },
    componentsMenu,
    formsMenu,
    tablesMenu,
    mapsMenu,
    pagesMenu,
    loginPage,
    registerPage,
    lockPage,
    {
      path: '/dashboard',
      component: Dashboard,
      name: 'dashboard',
      // redirect: '/theme/overview',
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('loggedIn') !== 'true') {
            next({
                path: '/'
            })
        } else {
            next()
        }
      },
    },
    {
      path: '/theme',
      component: DashboardLayout,
      redirect: '/theme/overview',
      // beforeEnter: (to, from, next) => {
      //   // if (localStorage.getItem('loggedIn') !== 'true') {
      //   //     next({
      //   //         //path: '/'
      //   //     })
      //   // } else {
      //   //     next()
      //   // }
      // },
      children: [
        {
          path: 'overview',
          name: 'Overview',
          component: Overview
        },
        {
          path: 'stats',
          name: 'Stats',
          component: Stats
        }
      ],
    },
  ],
});
