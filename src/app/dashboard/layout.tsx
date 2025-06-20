
import { ReactNode } from "react";

export const metadata = {
  title: 'Admin Dashboard - RevoShop',
  description: 'Manage products in the RevoShop database',
};

interface AdminLayoutProps { 
  children: ReactNode;
} 

export default function AdminLayout({ children }: AdminLayoutProps) {
  return children;
}
