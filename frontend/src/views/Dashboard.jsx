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
var QRCode = require('qrcode.react');
var walletAddr = "rfquzNgK8eb4LjR8Mf47SKpL78xTjm42YN";

AWS.config.update({
  accessKeyId: "ASIAWA26SJVXYXKIOSMH", 
  secretAccessKey: "JDSXpoQN/40vxfKbSrb95wpj6VnHmJVHfGndik90", 
  sessionToken : "FwoGZXIvYXdzEFAaDCoYoHfAK1CIPwXHbyK+Af71W82EbTdVToUp4D/fWn3t8gghrJfvMYN5tiePWZtXUotXMJdx34cr8HqfkP5LlPnN6E8LVD9sbNhrNe106peoKfOu7k4TOSOksxS0fEWcoR7jpl5bCc1ImmzitjRkNim8fZDZXB72vbPJ6qEM/3+703HRuOaZJIE+l1QKUJpt0aWUFs62plEqpRCujafIM4DWG/+8rwv0XCd4QSIsX7qhQF9FChovpxZEy/92cnYBAvZOU4t9wNkDMG/Jol0o/s3+8QUyLaJ4a60vK+bdGSvR+02uqkHMCl9WeKNzUDLtXXtHnefvtP3rKqiGcSESkdocxQ==",
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
      walletBalanceCurrent:  {
        labels: [],
        series: []
      },
      moneySpentLastHour:0
    };
  }

  updateBalance = async () => {
    //get current balance from dynamodb

    var params = {
    
      TableName: 'balance',
      KeyConditionExpression: '#pk = :key',

      ExpressionAttributeValues: {
        ":key": {"S" : "XVJpuQqHWBZcRaj6w4hcn4niiGijbaobeM64Usrwii2CJow"}
      },
      ExpressionAttributeNames: {
        "#pk": "publicKey"
      }

    };

    var data = await dynamodb.query(params).promise();
    this.setState({currBalance: (parseInt(data.Items[0] ? data.Items[0].walletBalance.S : 0) / 1000000).toString()})
  }

  currentUsageInit = async () => {
    var params = {
    
      TableName: 'SensorData',
      KeyConditionExpression: '#pk = :key',

      ExpressionAttributeValues: {
        ":key": {"S" : "XVJpuQqHWBZcRaj6w4hcn4niiGijbaobeM64Usrwii2CJow"}
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
      if(Date.now() - item.date.N < 3600000) {
        walletStates.series.push(item.reading.S)
        walletStates.labels.push(item.date.N.toString())
      }
    });
    let showDates = Math.floor(walletStates.labels.length / 5);
    for(let i=0; i<walletStates.labels.length;i++) {
      if(i%showDates!=0) {
        walletStates.labels[i] = "";
      } else {
        let newDate = new Date();
        newDate.setUTCMilliseconds(-Date.now());
        newDate.setUTCMilliseconds(parseInt(walletStates.labels[i]));

        walletStates.labels[i] = ((newDate.getHours() % 12) + ":" + newDate.getMinutes().toString())
        
      }
    }
    let newSeries=walletStates.series;
    walletStates.series = [newSeries];
    let sum=0;
    for(let i=0;i < walletStates.series[0].length; i++)
    {
      sum+=parseInt(walletStates.series[0][i]);
    }
    this.setState({walletBalanceCurrent: walletStates, moneySpentLastHour: sum*.000000188888888});

  }


  componentDidMount() {
    this.currentUsageInit()
    setInterval(this.currentUsageInit, 2000);
    setInterval(this.updateBalance, 2000);
  }



  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={4 } sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-warning" />}
                statsText="Wallet Balance"
                statsValue={"" + this.state.currBalance}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now" 
              />
            </Col>
            <Col lg={4 } sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Xrp Spent(1 hour)"
                statsValue={"" + this.state.moneySpentLastHour.toFixed(3)}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Cost (XRP KwH)"
                statsValue=".034"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last hour"
              />
            </Col>

          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="usage"
                title="Current Usage"
                category="Past Hour"
                stats="Updated now"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={this.state.walletBalanceCurrent}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
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

export default Dashboard;
