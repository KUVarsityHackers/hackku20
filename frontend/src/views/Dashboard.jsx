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
  accessKeyId: "ASIAWA26SJVXZPLUYGGT", 
  secretAccessKey: "d1Wphp5qq8jGwn2l9EP6Y2sHaE7EO/C5/6r3Uo/R", 
  sessionToken : "FwoGZXIvYXdzEE0aDALTCxzzif8tr5vN8SK+AbTzGRwHoFtyvEl+/lwi/Vixjp2MtQdNNDvklbYNGbNYnLdJvfXbCQOPAaoad0Eapw8HkL2ZsuMPNnSPsLU/Np1kD4j7qTvWZGI/xfjXiToBTXBgS35Bemf301Z63iJcoM1db22zIicpok7m19/PAHLof59eDAO/Shbs+4zT6GEwx1hzcpex2kj13rBZGi4R92JPEl1tMJgINsjDfeZtdGiYhGnUQs4UK6KbRLfcdxlJP402aa0Ts/dbTy+ecyIogvn98QUyLeEa1tqVDvdoJwoO/ObZickz/5fy5aPA0yrejWHnFHtpRD5ccpzVTMDm0gA+UA==",
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
      currBalance: 0,
      walletBalance:  {
        labels: [],
        series: []
      }
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
    this.setState({currBalance: (parseInt(data.Items[0].walletBalance.S) / 100000).toString()})
  }

  energyUsageInit = async () => {
    var params = {
    
      TableName: 'SensorData',
      KeyConditionExpression: '#pk = :key',

      ExpressionAttributeValues: {
        ":key": {"S" : "XVfkVt54arhWBMyWGq7ogsdTkeREmLSj6b4G7tGukY8SmSk"}
      },
      ExpressionAttributeNames: {
        "#pk": "publicKey"
      }

    };

    let data = await dynamodb.query(params).promise();
    let walletStates= {
      labels: [],
      series: []
    }
    data.Items.forEach(item => {
      walletStates.labels.push(item.date.N.toString())
      walletStates.series.push(item.reading.S)
    });
    let showDates = Math.floor(walletStates.labels.length / 5);
    console.log(showDates)
    for(let i=0; i<walletStates.labels.length;i++) {
      if(i%showDates!=0) {
        walletStates.labels[i] = "";
      } else {
        let newDate = new Date();
        newDate.setUTCMilliseconds(-Date.now());
        newDate.setUTCMilliseconds(parseInt(walletStates.labels[i]));
        console.log(newDate)

        walletStates.labels[i] = (newDate.getMonth().toString() + "/" + newDate.getDate().toString())
        
      }
    }
    let newSeries=walletStates.series;
    walletStates.series = [newSeries];
    this.setState({walletBalance: walletStates});

  }

  componentDidMount() {
    this.energyUsageInit()
    setInterval(this.updateBalance, 4000);
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
                      data={this.state.walletBalance}
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
