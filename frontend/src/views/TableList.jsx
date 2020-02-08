/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import ChartistGraph from "react-chartist";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";

import { StatsCard } from "components/StatsCard/StatsCard.jsx";

var QRCode = require('qrcode.react');
var walletAddr = "rfquzNgK8eb4LjR8Mf47SKpL78xTjm42YN";

class TableList extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Wallet Balance"
                statsValue="45 XRP"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Payments Made"
                statsValue="256"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Energy Usage"
                statsValue="2 [kWh]"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last hour"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Default Risk"
                statsValue="Low"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="usage"
                title="Energy Usage"
                category="Past 24 Hours"
                stats="Updated now"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data=""
                      type="Line"
                      options=""
                      responsiveOptions=""
                    />
                  </div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                  statsIcon="fa fa-clock-o"
                  title= "Reload Wallet"
                  category= "Add XRP to your Wallet"
                  stats={walletAddr}
                  content={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                    <QRCode value={walletAddr}/>
                    </div>
                  }
                />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default TableList;
