import { productRoutes } from "./../modules/Product/Product.route";
import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { userRoutes } from "../modules/User/user.route";
import { categoryRoutes } from "../modules/Category/Category.routes";
import { analyticsRoutes } from "../modules/Analytics/analytics.routes";
import { CompanyRoutes } from "../modules/Company/company.route";
import { rawMaterialRoutes } from "../modules/RawMaterial/rawMaterial.route";
import { customerRoutes } from "../modules/Customer/Customer.route";
import { assetRoutes } from "../modules/Asset/Asset.route";

const routers = Router();
const moduleRoutes: { path: string; route: Router }[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/company",
    route: CompanyRoutes,
  },
  {
    path: "/raw-materials",
    route: rawMaterialRoutes,
  },
  {
    path: "/products",
    route: productRoutes,
  },
  {
    path: "/customers",
    route: customerRoutes,
  },
  {
    path: "/assets",
    route: assetRoutes,
  },
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/analytics",
    route: analyticsRoutes,
  },
];

moduleRoutes.forEach((route) => routers.use(route.path, route.route));

export default routers;
