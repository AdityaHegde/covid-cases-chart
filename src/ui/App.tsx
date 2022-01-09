import React from "react";
import Layout, {Content, Header} from "antd/lib/layout/layout";
import {CovidCasesChart} from "./CovidCasesChart";

export function App() {
  return (
    <Layout>
      <Header>
      </Header>
      <Content style={{ minHeight: "1000px", margin: "25px" }}>
        <CovidCasesChart />
      </Content>
    </Layout>
  )
}
