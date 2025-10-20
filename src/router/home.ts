// Layouts
import LayoutDefault from "@/layouts/default.vue";

// Pages
const Home = () => import("@/views/home").then(m => m.Home);

const home = [
  {
    path: "/",
    component: LayoutDefault,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        meta: {
          breadcrumb: "Home Movie",
        },
      },
    ],
  },
];

export default home;
