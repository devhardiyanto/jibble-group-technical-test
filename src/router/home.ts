// Layouts
// import AuthLayout from "@/layouts/AuthLayout.vue";

// Pages
const Home = () => import("@/views/home").then(m => m.Home);

const home = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
      },
    ],
  },
];

export default home;
