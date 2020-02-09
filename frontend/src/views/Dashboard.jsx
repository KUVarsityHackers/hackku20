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
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

var AWS = require('aws-sdk/dist/aws-sdk-react-native');
AWS.config.update({
  accessKeyId: "ASIAWA26SJVXUWBKJGVB", 
  secretAccessKey: "QptSM48fhn5q6PmOQ7RAvYdYf2PGIfaym6MQJ6nG", 
  sessionToken : "FwoGZXIvYXdzEEgaDHLh865rPKxwWgyjAyK+AUqhdPvgi127Abx5uHfud07mZ5NiQTwHZ5vF+x9nYbWOtIugkEJpbeNrSIS4+ZCGqzZupvz9aNyc1vjh9tFfWO2pGnVfNpHf6kli+pIcTq9xptlpzKCnqbXxNUcNmwWKxXYFleNrwUsF1QM5wu37RU57BeLtQmoJlr16+/VlWGrwHH5vdIecazsgZqTrshEbLUZExowpc3xgCG1fEVjaNjOIDhZmsfEdfSJ2pFaiWrfr/+jWeKBGGjYGteS18IUo7fb88QUyLdw/4NX4VbpToXWPDMi+OlFIuxRqDGebbOFOy7CjcZyihfzDq9I1/p9WExrjPA==",
  region:'us-east-1'
});

var dynamodb = new AWS.DynamoDB();

class Dashboard extends Component {
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  constructor(props) {
    super(props);
    this.state = {
      currBalance: 0
    };
  }

  updateBalance = async () => {
    //get current balance from dynamodb

    var params = {
    
      TableName: 'balance',
      KeyConditionExpression: '#pk = :key',

      ExpressionAttributeValues: {
        ":key": {"S" : "XVfkVt54arhWBMyWGq7ogsdTkeREmLSj6b4G7tGukY8SmSk"}
      },
      ExpressionAttributeNames: {
        "#pk": "publicKey"
      }

    };

    var data = await dynamodb.query(params).promise();
    console.log(data.Items[0].drops.N)
    this.setState({currBalance: data.Items[0].drops.N})
  }
  
  componentDidMount() {
    setInterval(this.updateBalance, 1000);
  }



  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Wallet Balance"
                statsValue={"" + this.state.currBalance}
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
            <Col>
              <Card
                statsIcon="fa fa-history"
                id="usage"
                title="Energy Usage"
                category="Past 24 Hours"
                stats="Updated now"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
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

export default Dashboard;
