
# Getting Started With Highcharts Using Angular 7
![highcharts-simplified](https://i.imgur.com/dw8Daol.gif)
This project provides a beginner's guide to highcharts using angular 7. It provides steps to develop an angular 7 application  from scratch and the integrates highcharts in to it. For those who want to integrate High Charts into
an existing project, head straight to: [Integrating Highcharts to angular app](https://github.com/m-haziq/highcharts-simplified/blob/master/README.md#integrating-high-charts).
> This project uses ubuntu 18.04. If you use any other OS then you might need to change few commands syntax accordingly.
## Getting Started
Before we start, we need this to be installed:
- [Angular CLI](https://cli.angular.io/)
Use this command to install it: 
```
npm install -g @angular/cli
```
If installed, use this command to verify your installation:
```
ng --version
```
## Project Setup
Making a project using Angular CLI is pretty simple. Make sure you are in the right directory to initialize the project:
```
ng new angular7-highcharts
```
You can see that project has been initialized in directory "angular7-highcharts". Now let us run this project:
```
cd angular7-highcharts
ng serve
```
Your app is running on `http://localhost:4200/`, you will see a default welcome page.
### Making a new component:
Angular 7 is highly component based, so we should make another component for chart view as:
```
ng generate component output-graph
```
You can see newly created component "output-graph" if you navigate to `/src/app/`. There are four types of files:
###### .CSS:
All css for styles should go in to this file.
###### .HTML:
This files includes HTML template inside it, includes all html tags.
###### .TS:
This file includes all typescript code, it includes business logic, API calling and data manipulation.
###### .SPEC.TS:
All unit tests go in to this file. We will not cover angular 7 unit tests in this tutorial.
### Modify parent component app:
Now moving towards modifying app component according to our need. Remove extra default content from  `app/app.component.html` and include our new component as:
```
<div id="main-head" style="text-align:center">
  <h1>
    Welcome to {{ title }}!
  </h1>
  <app-output-graph></app-output-graph>
</div>
<router-outlet></router-outlet>
```
> **app-output-graph** is selector of our new component.
Now, we can add/modify the content of our parent component by changing variables i.e. `title` in the file `app/app.component.ts` as:
```
...
export class AppComponent {
  title = 'High Charts Simplified';
}
```
Now add some styles to this parent component `app/app.component.css` file as:
```
#main-head{
  background-color: cornflowerblue;
  text-align: center;
}
```
## Integrating High Charts:
Now we move forward to add high chart to our new component output-graph, starting with adding a new div to `output-graph/output-graph.component.html` as:
```
<div id="container"></div>
```
Now, we are going to add highchart programmatically to this div. As discussed that all the business logic is inside .ts file. So we start with adding a simple highchart to the file `output-graph/output-graph.component.ts` as:
```
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit {
  public options: any = {
    chart: {
      type: 'scatter',
      height: 700
    },
    title: {
      text: 'Sample Scatter Plot'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return '<b>x: </b>' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
          ' <br> <b>y: </b>' + this.y.toFixed(2);
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function() {
          return Highcharts.dateFormat('%e %b %y', this.value);
        }
      }
    },
    series: [
      {
        name: 'Normal',
        turboThreshold: 500000,
        data: [[new Date('2018-01-25 18:38:31').getTime(), 2]]
      },
      {
        name: 'Abnormal',
        turboThreshold: 500000,
        data: [[new Date('2018-02-05 18:38:31').getTime(), 7]]
      }
    ]
  }
  constructor() { }

  ngOnInit(){
    Highcharts.chart('container', this.options);
  }
}
```
We have got our code ready, but we have never installed highcharts dependency, so run this:
```
npm install highcharts
```
We are all set up to go. run your app with `ng serve`. **Whoaa!** We have got a simple high chart running with 2 hard coded points on it. Going towards explanation **options** includes all the properties which highchart may need to draw itself it includes:
**chart** : explains the chart type etc.
**title** : includes chart title.
**tooltip** : includes customization for tooltip on hover and stuff.
**series** : includes the data and catagories of data, in our case we have normal and abnormal data generated from an AI (artificial intelligence data).

Now the method `ngOnInit()` actually is the trigger which asks app to draw the highchart inside div having id `container` with default settings as `this.options`.

> In order to customize  highcharts and explore more types of highchart you should visit [HIGH CHART OFFICIAL DOCUMENTATION](https://api.highcharts.com/highcharts/).

### Populating Highcharts data with Live Dynamic data:
Ofcourse we need dynamic data inside our highchart. So in order to get the data I have a sample [API](https://api.myjson.com/bins/13lnf4). You can use your API which returns you data or this one for learning purpose. Now modify the code inside `output-graph/output-graph.component.ts` to:
```
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit {
  public options: any = {
    chart: {
      type: 'scatter',
      height: 700
    },
    title: {
      text: 'Sample Scatter Plot'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return '<b>x: </b>' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
          ' <br> <b>y: </b>' + this.y.toFixed(2);
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function() {
          return Highcharts.dateFormat('%e %b %y', this.value);
        }
      }
    },
    series: [
      {
        name: 'Normal',
        turboThreshold: 500000,
        data: []
      },
      {
        name: 'Abnormal',
        turboThreshold: 500000,
        data: []
      }
    ]
  }
  subscription: Subscription;
  constructor(private http: HttpClient) { }

  ngOnInit(){
    // Set 10 seconds interval to update data again and again
    const source = interval(10000);

    // Sample API
    const apiLink = 'https://api.myjson.com/bins/13lnf4';

    this.subscription = source.subscribe(val => this.getApiResponse(apiLink).then(
      data => {
        const updated_normal_data = [];
        const updated_abnormal_data = [];
        data.forEach(row => {
          const temp_row = [
            new Date(row.timestamp).getTime(),
            row.value
          ];
          row.Normal === 1 ? updated_normal_data.push(temp_row) : updated_abnormal_data.push(temp_row);
        });
        this.options.series[0]['data'] = updated_normal_data;
        this.options.series[1]['data'] = updated_abnormal_data;
        Highcharts.chart('container', this.options);
      },
      error => {
        console.log('Something went wrong.');
      })
    );
  }

  getApiResponse(url) {
    return this.http.get<any>(url, {})
      .toPromise().then(res => {
        return res;
      });
  }
}
```
We have an other function `getApiResponse(url)` which calls our API, Plus we call the same API after every 10 seconds to get live data(in this case it returns the same data again and again though).  We have missing dependency of HttpClient which we need to add to `app/app.module.ts` as(rest of the file remains the same):
```
...
import { HttpClientModule } from '@angular/common/http';
...
@NgModule({
  ...
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  ...
})
```
Now run your app with `ng serve`. By this time you have:
- Angular 7 application
- With integrated Highcharts
- With Live data from API

> In order to customize  highcharts and explore more types of highchart you should visit [HIGH CHART OFFICIAL DOCUMENTATION](https://api.highcharts.com/highcharts/).
## End Note:

This repository is intended to help those beginners who find it hard
using **highcharts** with **angular7**. If you like this effort, please like and share this with others. 
If you have any suggestions, comment here or approach me on [linkedin](https://www.linkedin.com/in/m-haziq/) , [medium](https://medium.com/@m_haziq/), [twitter](https://twitter.com/contacthaziq) 
or send me an [email](mailto:m_haziq@outlook.com) to discuss in person. 
I would love to hear from you.
