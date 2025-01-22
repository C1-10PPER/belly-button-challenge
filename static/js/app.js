// Created a function for the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Retreived the metadata field
    let metadata = data.metadata;

    // Filtered the metadata for the object with the desired sample number
    let result = metadata.find(meta => meta.id === parseInt(sample));


    // Used d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Used `.html("") to clear any existing metadata
    panel.html("");

    // Created a loop and used d3 to append new
    // tags for each key-value in the filtered metadata.
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        // Append a new paragraph for each key-value pair
            panel.append("p").text(`${key}: ${value}`);
          });
        } else {
          panel.append("p").text("No metadata found for the selected sample.");
  }
  });
}

// Created a function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Retrieved the samples field
    let samples = data.samples;

    // Filtered the samples for the object with the desired sample number
    let result = samples.find(s => s.id === sample);
    if (!result) {
      console.error("Sample data not found for:", sample);
      return;
    }


    // Retreived the otu_ids, otu_labels, and sample_values from the result
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubbleChart = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Cividis"
      }
    };

    let bubbleData = [bubbleChart];
  
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      showlegend: false
    };

    // Displayed the Bubble Chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Mapped the otu_ids to a list of strings for the yticks in the Bar Chart.

    let OTUData = otu_ids.map((id, index) => ({
      otu_id: id,
      sample_value: sample_values[index],
      otu_label: otu_labels[index]
    }))
    // Sorted the data in descending order
      .sort((a, b) => b.sample_value - a.sample_value) 
      .slice(0, 10); //Extracted the top 10 OTUs with the highest sample values

    // Extracted the OTU ID's, OTU labels and OTU values and reversed the order for display.
    let Ids = OTUData.map(d => `OTU ${d.otu_id}`).reverse();
    let Labels = OTUData.map(d => d.otu_label).reverse();
    let Values = OTUData.map(d => d.sample_value).reverse();


    // Build a Bar Chart

    let barTrace = {
      x: Values,
      y: Ids,
      text: Labels,
      type: "bar",
      orientation: "h"
    };

    let barData = [barTrace];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
    };

    // Displayed the Bar Chart

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Created a function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Retrieved the names field
      let sampleNames = data.names;

    // Created a loop and used D3 to append a new option for each sample name in the dropdown menu.
    let dropdown = d3.select("#selDataset");
    sampleNames.forEach(sample => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Retrieved the first sample from the list
    let firstSample = sampleNames[0];
    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });

}

// Created a function to handle changes in the dropdown selection
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  }

// Initialized the dashboard
init();
