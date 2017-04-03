(function(){


//1) square
	var width = 1400,
	height = 1000;


//2) pull out div based on id; add svg to it; give it height and width;
//put g inside and transform to stay exatly where it was


	var svg = d3.select("#chart")
	.append("svg")
	.attr("height",height)
	.attr("width",width)
	/*var g = svg.append("g")*/

/*14.5) can use "translate (" + width / 2 + "," + height / 2 + ")")
instead and keep as ----> d3.forceX()
*/
	/*.attr("transform", "translate(0,0)")*/

/*12) Now we try to put values of data to get circles in different sizes

Step1: we make a scale and use sqaure root scale since it is the radius of circle
add smallest to largest data values with smallest to largest circle radius
*/




var radiusScale = d3.scaleSqrt().domain([10, 300]).range([10, 80])

//16) Now we work with svg and defs; mainly pattern defs
/*
<defs>
  <pattern id="img1" patternUnits="userSpaceOnUse" width="100" height="100">
    <image xlink:href="wall.jpg" x="0" y="0" width="100" height="100" />
  </pattern>
</defs>
*/
var defs = svg.append("defs");
defs.append("pattern")
	.attr("id", "mew")
	.attr("height", "100%")
	.attr("width", "100%")
	.attr("patternContentUnits", "objectBoundingBox")
	.append("image")
	.attr("height", 1)
	.attr("width", 1)
	.attr("preserveAspectRatio", "none")
	.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
	.attr("xlink:href", "mew.jpg")


//5) create a simulation; it takes ecery single one of the circles and applies
//forces to them in order to push them to a certain position
//8.5) VIV: Simulation is a colliection of forces
//about where we want our circles to go
//and how we want our circles to interact

//22) since adding functions within forceX becomes complicated and cluttery
//we create a variable





	var forceYSeparate = d3.forceY(function(d){
//24) adding conditional split
		if(d.stream === 'database'){
			return 200
		}
		if(d.stream === 'programming'){
			return 200
		}
		if(d.stream === 'web-dev'){
			return 500
		}
		if(d.stream === 'analytics'){
			return 800
		}
		else {
			return 800
		}
	}).strength(0.05)

	var forceXSeparate = d3.forceX(function(d){
//24) adding conditional split
		if(d.stream === 'database'){
			return 200
		}
		if(d.stream === 'programming'){
			return 800
		}
		if(d.stream === 'web-dev'){
			return 500
		}
		if(d.stream === 'analytics'){
			return 200
		}
		else {
			return 800
		}
	}).strength(0.05)


//28) restructure code with forceXSeparate and forceXCombine

var forceXCombine = d3.forceX(width / 2).strength(0.05)
var forceYCombine = d3.forceY(height / 2).strength(0.05)

	var forceCollide = d3.forceCollide(function(d){
	//can add +1 to scale to push circles out even further
	return radiusScale(d.value) + 3;
})

	var simulation = d3.forceSimulation()

//9) add force to force nodes to math place
	/*.force("name", definetheforce)*/

//10) put nodes at width/2

//21) we add function within ---> .force("x", d3.forceX(width / 2).strength(0.05))
//to execute conditional placing of nodes
	.force("x", forceXCombine)
	.force("y", forceYCombine)

/*11) Step 1: Get them nodes to the middle
Step 2:Don't have them collide
Step3: As long as the radius of the circle matches the radius of the force
collide input, it won't overlap
*/

/*14) Now we add function with forcecollide to change ---> .force("collide", d3.forceCollide(10))
similar to step 13 to avoid overlapping of circular areas
As best practice use function(d){return 10;} as replacement to just 10 to confirm
that functions fits and works in that line of code

Hence as circle gets bigger the collision force also gets bigger
*/
//23) Similarly we creare variable for forceCollide
.force("collide", forceCollide)

//mbostock1
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width / 2, height / 2))



//3) pull in sales to csv

	d3.queue()
	.defer(d3.csv, "skills.csv")
	.await(ready)


//4) Then we draw circles; for every single data point we draw a circle;
//give it a radius 10; git it colour; and give it a class






	function ready(error, datapoints) {


//mbostock2



//18)
		defs.selectAll(".artist-pattern")
		.data(datapoints)
		.enter().append("pattern")
		.attr("class", "artist-pattern")
//19) copy all the pattern elements and paste here
		.attr("id", function(d){
			return d.id
		})
		.attr("height", "100%")
		.attr("width", "100%")
		.attr("patternContentUnits", "objectBoundingBox")
		.append("image")
		.attr("height", 1)
		.attr("width", 1)
		.attr("preserveAspectRatio", "none")
		.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
		.attr("xlink:href", function(d){
			return d.image_path
		});

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var elem = svg.selectAll(".artist")
		.data(datapoints)

		.enter()

		.append("g")
	    .attr("transform", function(d){return "translate(0,0)"})

//17.5) Added row entries to define number of circle as per rows in data, similarly
//we will selectall enter append 15 different patterns to our def		.artist is class
		var circles = elem.append("circle")

		.on('mouseover', function(d){
			console.log(d)

			div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html("Skill: " + (d.name) + "<br/>"  + d.description)
                .style("left", (d3.event.pageX + 500) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                

		})
		.on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
		.attr("class", "artist")
//13) Instead of always making circle radius 10 ----->.attr("r", 10) we change to
		.attr("r", function(d){
			return radiusScale(d.value)
		})
//	17) now we put pattern id to this--> .attr("fill", "lightblue")
/*
function(d){
			return "url(#" + d.id+ ")"
		}
*/

//ADDING ID FOR REFERENCE TO DIALOGBOX JS
		.attr("id","skill-details")
		.attr("fill", function(d){
			return "url(#" + d.id+ ")"
		})
//15) we can still use tooltips and transitions used in d3 visualizations

		.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));



//shows skill name on mouseover
  circles.append("title")
      .text(function(d) { return "Skill: " + d.name; });

//fix text on canvas with id and 0 opacity


////////////////////////////////////////////////////*************NEED TO WORK ON TEXT FORCE*****************\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var label = svg.append("g").selectAll("text")

.enter().append("text")
				.attr("x", 8)
                 .attr("y", ".31em")
					
					.text(function(d) { return "Skill: " + d.name; })
					.attr("font-size", "20px")
					.attr("fill", "red")
					.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));



/*var label = circles.append("text");
var labeldecor = label
					.attr("x", function(d){return -20})
					
					.text(function(d) { return "Skill: " + d.name; })
					.attr("font-size", "20px")
					.attr("fill", "red");*/

svg.append("text")
	.attr("x", 150)
	.attr("y", 150)
	.attr("id","databasetag")
	.attr("class", "legend")
	.style("fill", "black")
	.text("Database 40%")
	.attr("font-size", "20px");

var active   = databasetag.active ? false : true,
newOpacity = active ? 0 : 1;
d3.select("#databasetag").style("opacity", 0);




svg.append("text")
	.attr("x", 650)
	.attr("y", 250)
	.attr("id","webdevtag")
	.attr("class", "legend")
	.style("fill", "black")
	.text("Web Development 15%")
	.attr("font-size", "20px");

var active   = webdevtag.active ? false : true,
newOpacity = active ? 0 : 1;
d3.select("#webdevtag").style("opacity", 0);



svg.append("text")
	.attr("x", 1200)
	.attr("y", 150)
	.attr("id","programmingtag")
	.attr("class", "legend")
	.style("fill", "black")
	.text("Programming 15%")
	.attr("font-size", "20px");

var active   = programmingtag.active ? false : true,
newOpacity = active ? 0 : 1;
d3.select("#programmingtag").style("opacity", 0);



svg.append("text")
	.attr("x", 150)
	.attr("y", 850)
	.attr("id","analyticstag")
	.attr("class", "legend")
	.style("fill", "black")
	.text("Analytics 30%")
	.attr("font-size", "20px");

var active   = analyticstag.active ? false : true,
newOpacity = active ? 0 : 1;
d3.select("#analyticstag").style("opacity", 0);


svg.append("text")
	.attr("x", 1250)
	.attr("y", 850)
	.attr("id","ppttag")
	.attr("class", "legend")
	.style("fill", "black")
	.text("Presentation")
	.attr("font-size", "20px");

var active   = ppttag.active ? false : true,
newOpacity = active ? 0 : 1;
d3.select("#ppttag").style("opacity", 0);




/*

4.5) Move all circles to the same place for example
.attr("cx", 100)
.attr("cy", 300)

*/
//20) After adding buttons in html doc we wr9te code to observe click events on it

d3.select("#decade").on('click', function(){



		simulation
//27) subtitute w / 2 with conditional forceX
	.force("x", forceXSeparate)
	.force("y", forceYSeparate)
	.alphaTarget(1.0)
	.restart()

		//var active   = databasetag.active ? false : true,
		  //newOpacity = active ? 0 : 1;
		// Hide or show the elements

		// Update whether or not the elements are active

			 d3.select("#databasetag").style("opacity", 1);
			 d3.select("#webdevtag").style("opacity", 1);
			 d3.select("#programmingtag").style("opacity", 1);
			 d3.select("#analyticstag").style("opacity", 1);
			 d3.select("#ppttag").style("opacity", 1);


})


//24) Combine event
d3.select("#combine").on('click', function(){
	simulation
//25) overwrite forceX using simulation.force("X"
	.force("x", forceXCombine)
	.force("y", forceYCombine)
//26) renew force strength, everytime you change simulation, we nudge it with alphatarget
//to explain how quickly it should be moving and restart simulation
	.alphaTarget(0.10)
	.restart()

		// Determine if current line is visible
		//var active   = databasetag.active ? false : true,
		  //newOpacity = active ? 0 : 1;
		// Hide or show the elements

		// Update whether or not the elements are active

			 d3.select("#databasetag").style("opacity", 0);
			d3.select("#webdevtag").style("opacity", 0);
			 d3.select("#programmingtag").style("opacity", 0);
			 d3.select("#analyticstag").style("opacity", 0);
			 d3.select("#ppttag").style("opacity", 0);



})

//6) feed all of our datapoints to the simulation to use it nodes=circles
		simulation.nodes(datapoints)

//8) on every single tick fire ticked function()

		.on('tick', ticked)








//7) to perform a push simulation works likes a clock, it keeps ticking
//evrytime a sec goes by it updates the nodes position
//We need to define the code that fires on every tick of the clock vis a vis
//on every tick of the simulation

//Create function ticked; every time it is called it goes and grabs the circles
//and we set their cx's and cy's: d.x is "data on x position"


		function ticked(){
			circles
			.attr("cx", function(d){
				return d.x
			})
			.attr("cy", function(d){
				return d.y
			})
		}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.5).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0.5);
  d.fx = null;
  d.fy = null;
}
	}
})();
