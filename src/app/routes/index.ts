import { productRoutes } from "./../modules/Product/Product.route";
import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { userRoutes } from "../modules/User/user.route";
import { analyticsRoutes } from "../modules/Analytics/analytics.routes";
import { CompanyRoutes } from "../modules/Company/company.route";
import { rawMaterialRoutes } from "../modules/RawMaterial/rawMaterial.route";
import { customerRoutes } from "../modules/Customer/Customer.route";
import { assetRoutes } from "../modules/Asset/Asset.route";
import { reportAnalysisRoutes } from "../modules/ReportAnalycis/reportAnalysis.routes";
import { PlanRoutes } from "../modules/Plan/plan.route";
import { PaymentRoutes } from "../modules/Payment/Payment.routes";

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
    path: "/analytics",
    route: analyticsRoutes,
  },
  {
    path: "/report-analysis",
    route: reportAnalysisRoutes,
  },
  {
    path: "/plans",
    route: PlanRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => routers.use(route.path, route.route));

export default routers;
