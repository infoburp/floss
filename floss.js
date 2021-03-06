var titlex = 0;
var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
	height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 2;
var margin = {top: 20, right: 0, bottom: 20, left: 84};
    width = width - margin.right - margin.left;
    height = height - margin.top - margin.bottom;
var i = 0,
	duration = 750,
	root;
var tree = d3.layout.tree().size([height, width]);
var diagonal = d3.svg.diagonal().projection(function(d)
{
	return [d.y, d.x];
});
var svg = d3.select("body").append("svg")
    .attr("width", width + 16)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.json("data.json", function(error, flare)
{
	root = flare;
	root.x0 = height / 2;
	root.y0 = 16;

	function collapse(d)
	{
		if (d.children)
		{
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}
	root.children.forEach(collapse);
	update(root);
});

function update(source)
	{
		
		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);
		// Normalize for fixed-depth.
		nodes.forEach(function(d)
		{
			d.y = d.depth * 160;
		});
		// Update the nodes…
		var node = svg.selectAll("g.node").data(nodes, function(d)
		{
			return d.id || (d.id = ++i);
		});
		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g").attr("class", "node").attr("transform", function(d)
		{
			return "translate(" + source.y0 + "," + source.x0 + ")";
		}).on("click", click);
		nodeEnter.append("circle").attr("r", 1e-6).style("fill", function(d)
		{
			return d._children ? "#191919" : "#191919";
		});
		nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);
		// Transition nodes to their new position.
		var nodeUpdate = node.transition().duration(duration).attr("transform", function(d)
		{
			return "translate(" + d.y + "," + d.x + ")";
		});
		nodeUpdate.select("circle").attr("r", 2).style("fill", function(d)
		{
			return d._children ? "#191919" : "#191919";
		});
		nodeUpdate.select("text").style("fill-opacity", 1);
		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition().duration(duration).attr("transform", function(d)
		{
			return "translate(" + source.y + "," + source.x + ")";
		}).remove();
		nodeExit.select("circle").attr("r", 1e-6);
		nodeExit.select("text").style("fill-opacity", 1e-6);
		// Update the links…
		var link = svg.selectAll("path.link").data(links, function(d)
		{
			return d.target.id;
		});
		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g").attr("class", "link").attr("d", function(d)
		{
			var o = {
				x: source.x0,
				y: source.y0
			};
			return diagonal(
			{
				source: o,
				target: o
			});
		});
		// Transition links to their new position.
		link.transition().duration(duration).attr("d", diagonal);
		// Transition exiting nodes to the parent's new position.
		link.exit().transition().duration(duration).attr("d", function(d)
		{
			var o = {
				x: source.x,
				y: source.y
			};
			return diagonal(
			{
				source: o,
				target: o
			});
		}).remove();
		// Stash the old positions for transition.
		nodes.forEach(function(d)
		{
			d.x0 = d.x;
			d.y0 = d.y;
		});
			$("img#title").css({"top": root.x0+"px", "left": 4+"px"}); 

	}
	// Toggle children on click.
function click(d)
{
	if (d.children)
	{
		d._children = d.children;
		d.children = null;
	}
	else
	{
		d.children = d._children;
		d._children = null;
		$('#article').wikiblurb(
		{
			wikiURL: "http://en.wikipedia.org/",
			apiPath: 'w',
			section: 0,
			page: d.name,
			removeLinks: false,
			type: 'all',
			customSelector: ''
		});
	}
	update(d);
}
$(document).ready(function()
{
	$('#article').wikiblurb(
	{
		wikiURL: "http://en.wikipedia.org/",
		apiPath: 'w',
		section: 0,
		page: 'Open-source_software',
		removeLinks: false,
		type: 'all',
		customSelector: ''
	});
});
setInterval(function() {
	
titlex=root.x0-90
   $("img#title").css({"top": titlex+"px", "left": 4+"px"});
}, 1);
