import React from "react";
import { Outlet, Link } from "react-router-dom";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 220px;
  background-color: #1e1e2f;
  color: white;
  padding: 20px;
`;

const Content = styled.div`
  flex: 1;
  background-color: #f4f6fa;
  padding: 20px;
  overflow-y: auto;
  width: 100%;
`;


const NavLink = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 12px;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const DashboardLayout = () => {
  return (
    <LayoutWrapper>
      <Sidebar>
        <h2>Zenit</h2>
        <NavLink to="/">Durum</NavLink>
        <NavLink to="/map">Harita</NavLink>
        <NavLink to="/scenario">Senaryo</NavLink>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </LayoutWrapper>
  );
};

export default DashboardLayout;
