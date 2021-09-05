function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  })};
  

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
 
  
};


// Demographics Panel 
function buildMetadata(sample) {
  console.log(sample)

  d3.json("samples.json").then((datas) => {
    var metadata = datas.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
////////////////////Chanllenge start here 1///////////////////////////////
// 1. Create the buildCharts function.
function buildCharts(samples) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((sampledata) => {
    
    console.log(sampledata)
    // 3. Create a variable that holds the samples array. 
    var samplesArray = sampledata.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFilter=samplesArray.filter(sampleObj=>sampleObj.id=samples);
    
    //  5. Create a variable that holds the first sample in the array.
    var results = sampleFilter[0];
    console.log(results);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    var sample_values=results.sample_values;
    console.log(sample_values);
    var otu_labels=results.otu_labels;
    var otu_ids=results.otu_ids;
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descnding order  
    
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var xticks=sample_values.slice(0,10).reverse();
    var otu_label_10=otu_labels.slice(0,10).reverse();
    

    

    var trace={y:yticks,
      x:xticks,
      text:otu_label_10,
      type:"bar",
      orientation:"h"

    } ;
    // 8. Create the trace for the bar chart. 
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barlayout = {
      title:"TOP 10 BACTERIA CULTURES FOUND",

      xaxis:{title:""},
      yaxis:{title:""}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barlayout);
/////////////////Delieverable 2 ///////////////////////////
// 1. Create the trace for the bubble chart.
    trace={
      x:otu_ids,
      y:sample_values,
      text:otu_label_10,
      mode:"markers",
      marker: {
        size: sample_values,
            color: otu_ids,
            colorscale: "Earth",
              },
      hoverinfo: 'x+y+text'
      

    };
   
    var bubbleData = [trace
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {title:"Bacteria Cultures Per Sample",
                        hovermode:'closest',
                        xaxis:{title:"OTU ID"},
                        height: 800,
                        width: 1000,
                        font: {
                          family: 'Arial Black',
                          size: 16,
                          color: '#7f7f7f'}
                      

      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

/////////////////////////Deliverable 3 ///////////////////////////////////////////
    // 4. Create the trace for the gauge chart.
    var wfreqArray = sampledata.metadata.filter((val) => val.id == samples);
    wfreqArray = wfreqArray[0];
    console.log(wfreqArray);

    let wfreq = Object.values(wfreqArray)[6];
    console.log(wfreq);
   // var wfqcArray=sampledata.metadata.map(numbers=>numbers.wfreq);
    //console.log(wfqcArray);
    //wfqc_value=wfqcArray.filter(value=>wfqcArray.value==samples);
    
    
    
    var trace={
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      
      title: { text: "<b>Belly Button Washing Frequency<b><br> scrubs per Week" },
      type: "indicator",
      ///mode: "gauge+number+delta",
      mode: "gauge+number",
      ///delta: { reference: },
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6,8], color: "green" },
          { range: [8, 10], color: "dark green" },]
      }
      
    };

    var gaugeData = [
     trace
    ];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);



  });
}
