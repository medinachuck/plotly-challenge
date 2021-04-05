d3.json("samples.json").then((init_data) => {

    // create function to display initial charts and demographics
    function init() {
        // set variable for first 10 sample values of first sample
        var sample_values = init_data.samples[0].sample_values.slice(0, 10);
        // set variable for first 10 otu ids of first sample and map "OTU" to each id for use as labels
        var otu_ids = init_data.samples[0].otu_ids.slice(0, 10);
        otu_ids = otu_ids.map(id => "OTU " + id)
        // set variable for first 10 sample otu labels of first sample for hover text
        var otu_labels = init_data.samples[0].otu_labels.slice(0, 10);
        // reverse variables so chart displays larger values at the top
        sample_values = sample_values.reverse();
        otu_ids = otu_ids.reverse();
        otu_labels = otu_labels.reverse();
        // create trace for bar chart
        var trace1 = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };
        // set trace as data for bar chart
        var data = [trace1];
        // select div with bar id for plotting
        var CHART1 = d3.selectAll("#bar").node();
        // plot bar chart in selected div
        Plotly.newPlot(CHART1, data);

        // set variables for first sample for use in bubble chart
        var sample_values = init_data.samples[0].sample_values;
        var otu_ids = init_data.samples[0].otu_ids;
        var otu_labels = init_data.samples[0].otu_labels;
        
        // create trace for bubble chart
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        }
        // set trace as data for bubble chart
        var data = [trace2]
        // select div with bubble id for plotting
        var CHART2 = d3.selectAll("#bubble").node();
        // plot bubble chart in selected div
        Plotly.newPlot(CHART2, data);

        // set variable for first sample's metadata
        var metadata_values = init_data.metadata[0];
        // select div with sample metadata id for data population
        var demographic_info = d3.select("#sample-metadata");
        // create a <p> div for each key:value pair in metadata and add to selected div
        Object.entries(metadata_values).forEach(([key, value]) => {
            var row = demographic_info.append("p");
            row.text(key + ": " + value)
        })
    }

    // create function to populate the dropdown menu
    function populate_options() {
        // select the select div
        var select = d3.select("select");
        // set variable for samples in dataset
        var samples = init_data.samples;
        // use forEach loop to append an option to the selected div for each sample in dataset
        samples.forEach(sample => {
            var id = sample.id;
            var option = select.append("option");
            option.text(id);
        });
    }

    // create function to update plots when called
    function updatePlotly() {
        // select divs to be used for updating
        var dropdownMenu = d3.select("#selDataset");
        var dataset = dropdownMenu.node().value;
        var bar_chart = d3.selectAll("#bar").node();
        var bubble_chart = d3.selectAll("#bubble").node();
        // create empty lists to populate with updated dataset data
        var bar_x = [];
        var bar_y = [];
        var bubble_x = [];
        var bubble_y = [];
        var metadata_values = [];
        // set variable for samples in dataset
        var samples_data = init_data.samples;
        // set variable for chosen sample id in dropdown menu
        var target_dataset = samples_data.filter(sample => sample.id == dataset);
        // set variables for the sample that is selected in the dropdown menu to be used for updating the plots
        var target_id = target_dataset.map(sample => sample.id);
        var target_otu_ids = target_dataset.map(sample => sample.otu_ids);
        var target_sample_values = target_dataset.map(sample => sample.sample_values);
        // set variable for metadata in dataset
        var metadata = init_data.metadata;
        // set variable for chosen metadata sample id
        var target_metadata = metadata.filter(sample => sample.id == dataset);
        // create switch statement to change variables based on chosen dataset in dropdown menu
        switch(dataset) {
            // case when dataset is chosen in dropdown menu
            case target_id[0]:
                // variables to update bar chart
                bar_x = target_sample_values[0].slice(0,10).reverse();
                bar_y = target_otu_ids[0].slice(0,10).reverse().map(id => "OTU " + id);
                // variables to update bubble chart
                bubble_x = target_otu_ids[0];
                bubble_y = target_sample_values[0];
                // variable to update metadata 
                metadata_values = target_metadata[0];
                break;
            // default case
            default:
                // variables to update bar chart
                bar_x = samples_data[0].sample_values.slice(0, 10).reverse();
                bar_y = samples_data[0].otu_ids.slice(0, 10).reverse().map(id => "OTU " + id);
                // variables to update bubble chart
                bubble_x = samples_data[0].otu_ids;
                bubble_y = samples_data[0].sample_values;
                // variable to update metadata 
                metadata_values = metadata[0]
                break;
        }
        // update values in bar and bubble charts
        Plotly.restyle(bar_chart, "x", [bar_x]);
        Plotly.restyle(bar_chart, "y", [bar_y]);
        Plotly.restyle(bubble_chart, "x", [bubble_x]);
        Plotly.restyle(bubble_chart, "y", [bubble_y]);
        // select sample metadata div
        var demographic_info = d3.select("#sample-metadata");
        // reset html to be blank in demographics section
        demographic_info.html("");
        // repopulate demographics section with new dataset info
        Object.entries(metadata_values).forEach(([key, value]) => {
            var row = demographic_info.append("p");
            row.text(key + ": " + value)
        })
    }

    // call init() function to populate webpage when first loaded
    init();
    // call function to populate dropdown menu when first loaded
    populate_options();
    // update charts when dataset select div changes
    d3.select("#selDataset").on("change", updatePlotly);
})
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
