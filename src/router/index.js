import store from "@/store"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "simple-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/LoginPage.vue")
  },
  {
    path: "/",
    name: "home",
    meta: {
      layout: "app-layout",
      title: "Проекты"
    },
    component: () => import("@/views/HomePage.vue")
  },
  {
    path: "/profile",
    name: "profile",
    meta: {
      layout: "app-layout",
      title: "Профиль"
    },
    component: () => import("@/views/ProfilePage.vue")
  },

  // EMPLOYEES
  {
    path: "/employees",
    name: "employees",
    meta: {
      layout: "project-layout",
      title: "Сотрудники",
      roleName: ["ROLE_EMPLOYEES_SHOW"]
    },
    component: () => import("@/views/employees/EmployeeList.vue")
  },
  {
    path: "/employees/calendar",
    name: "employees-calendar",
    meta: {
      layout: "project-layout",
      title: "Сотрудники"
    },
    component: () => import("@/views/employees/EmployeeCalendar.vue")
  },
  {
    path: "/employee/view/:id",
    name: "employee-view",
    meta: {
      layout: "project-layout",
      title: "Сотрудники",
      roleName: ["ROLE_EMPLOYEES_SHOW"]
    },
    component: () => import("@/views/employees/EmployeeDetail.vue")
  },
  {
    path: "/employee/create",
    name: "employee-create",
    meta: {
      layout: "project-layout",
      title: "Сотрудники",
      roleName: ["ROLE_EMPLOYEES_EDIT"]
    },
    component: () => import("@/views/employees/employeeForm/EmployeeCreate.vue")
  },
  {
    path: "/employee/edit/:id",
    name: "employee-update",
    meta: {
      layout: "project-layout",
      title: "Сотрудники",
      roleName: ["ROLE_EMPLOYEES_EDIT"]
    },
    component: () => import("@/views/employees/employeeForm/EmployeeUpdate.vue")
  },
  {
    path: "/employees/dictionary",
    name: "employee-dictionary",
    meta: {
      layout: "project-layout",
      title: "Сотрудники",
      roleName: ["ROLE_EMPLOYEES_EDIT_DICTIONARY"]
    },
    component: () => import("@/views/employees/EmployeeDictionary.vue")
  },

  // AUTH
  {
    path: "/auth",
    name: "auth-user",
    meta: {
      layout: "project-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/auth/UserList.vue")
  },
  {
    path: "/auth/user/:id",
    name: "auth-user-detail",
    meta: {
      layout: "project-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/auth/UserDetail.vue")
  },
  {
    path: "/auth/user/add",
    name: "auth-user-create",
    meta: {
      layout: "project-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/auth/UserCreate.vue")
  },
  {
    path: "/auth/user/update/:id",
    name: "auth-user-update",
    meta: {
      layout: "project-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/auth/UserUpdate.vue")
  },
  {
    path: "/auth/roles",
    name: "auth-user-roles",
    meta: {
      layout: "project-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/auth/roles/RoleList.vue")
  },
  {
    path: "/auth/role/:id",
    name: "auth-user-role-detail",
    meta: {
      layout: "project-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/auth/roles/RoleDetail.vue")
  },
  {
    path: "/auth/role/add",
    name: "auth-user-role-create",
    meta: {
      layout: "project-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/auth/roles/RoleCreate.vue")
  },
  {
    path: "/auth/role/update/:id",
    name: "auth-user-role-update",
    meta: {
      layout: "project-layout",
      title: "Авторизация"
    },
    component: () => import("@/views/auth/roles/RoleUpdate.vue")
  },

  // OSSA
  {
    path: "/ossa",
    name: "panel",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/panel/PanelMain.vue")
  },
  {
    path: "/ossa/calls",
    name: "calls",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/calls/CallList.vue")
  },
  {
    path: "/ossa/calls-graphic",
    name: "calls-graphics",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/callsGraphic/CallGraphic.vue")
  },
  {
    path: "/ossa/call/view/:id",
    name: "call-view",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/calls/CallView.vue")
  },
  {
    path: "/ossa/calls-operator",
    name: "calls-operator",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/callsGraphic/CallGraphic.vue")
  },
  {
    path: "/ossa/calls-sro",
    name: "calls-sro",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/callsGraphic/CallGraphic.vue")
  },
  {
    path: "/ossa/calls-hourly-by-type",
    name: "calls-hourly-by-type",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/callsGraphic/CallGraphic.vue")
  },
  {
    path: "/ossa/work-plan",
    name: "work-plan",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/workPlan/WorkPlanTabs.vue")
  },
  {
    path: "/ossa/work-plan/view/:id",
    name: "work-plan-view",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/agents/AgentView.vue")
  },
  {
    path: "/ossa/agent-list",
    name: "agent-list",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/agents/AgentList.vue")
  },
  {
    path: "/ossa/agent/view/:id",
    name: "agent-view",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/agents/AgentView.vue")
  },
  {
    path: "/ossa/event-do-graphic",
    name: "event-do-graphic",
    meta: {
      layout: "project-layout",
      title: "ОССА"
    },
    component: () => import("@/views/ossa/eventDoGraphic/EventDoGraphic.vue")
  },

  // Mailer
  {
    path: "/mailer",
    name: "package-list",
    meta: {
      layout: "project-layout",
      title: "Рассылка"
    },
    component: () => import("@/views/mailer/package/PackageList.vue")
  },
  {
    path: "/mailer/package/add",
    name: "mailer-package-create",
    meta: {
      layout: "project-layout",
      title: "Рассылка"
    },
    component: () => import("@/views/mailer/package/PackageCreate.vue")
  },
  {
    path: "/mailer/members-in-package/:id",
    name: "members-in-package",
    meta: {
      layout: "project-layout",
      title: "Рассылка"
    },
    component: () => import("@/views/mailer/package/packageDetail/PackageDetail.vue")
  },
  {
    path: "/mailer/schedule",
    name: "mailer-sro-list",
    meta: {
      layout: "project-layout",
      title: "Рассылка"
    },
    component: () => import("@/views/mailer/schedule/SroList.vue")
  },
  {
    path: "/mailer/schedule/add/:id",
    name: "mailer-sro-schedule-add",
    meta: {
      layout: "project-layout",
      title: "Рассылка"
    },
    component: () => import("@/views/mailer/schedule/scheduleForm/SroScheduleCreate.vue")
  },
  {
    path: "/mailer/schedule/view/:id",
    name: "mailer-sro-schedule-view",
    meta: {
      layout: "project-layout",
      title: "Рассылка"
    },
    component: () => import("@/views/mailer/schedule/SroScheduleDetail.vue")
  },
  {
    path: "/mailer/schedule/edit/:id",
    name: "mailer-sro-schedule-edit",
    meta: {
      layout: "project-layout",
      title: "Рассылка"
    },
    component: () => import("@/views/mailer/schedule/scheduleForm/SroScheduleUpdate.vue")
  },
  {
    path: "/mailer/calendar",
    name: "mailer-calendar",
    meta: {
      layout: "project-layout",
      title: "Рассылка"
    },
    component: () => import("@/views/mailer/calendar/MailerCalendar.vue")
  },

  // Not found
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    meta: {
      layout: "simple-layout",
      title: "Not found"
    },
    component: () => import("@/views/NotFound.vue")
  },

  // Test
  {
    path: "/test",
    name: "test",
    meta: {
      layout: "app-layout",
      title: "Test"
    },
    component: () => import("@/views/Test.vue")
  }
]

// Vue router
const router = createRouter({
  history: createWebHistory(),
  routes
})

const anonymousRoutes = ["login"]

router.beforeEach(async (to, from, next) => {
  // Set title
  document.title = to.meta.title || "Проекты"

  // Check access
  const isAuth = store.getters["auth/isAuthenticated"]

  if (!isAuth && !anonymousRoutes.includes(to.name)) {
    return next({ name: "login" })
  }

  // Если авторизованный пользователь пытается зайти в login, то перенаправляется в home
  if (isAuth && to.name === "login") return next({ name: "home" })

  // Allow only available routes
  if (isAuth) {
    let userRoles = store.getters["auth/userRoles"]
    const requiredRoles = to.meta.roleName

    if (!requiredRoles || requiredRoles.length === 0) {
      // Если нет roleName - роут общий для всех
      return next()
    }

    const hasAccess = requiredRoles.some(role => userRoles.includes(role))
    // Если есть roleName - проверить доступен ли роут для этого roleName у пользователя
    // Если авторизованный пользователь пытается зайти в login, то перенаправляется в home
    if (hasAccess) {
      return next()
    } else {
      return next({ name: "home" })
    }
  }

  return next()
})

export default router
