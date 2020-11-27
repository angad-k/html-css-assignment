var node_list, adj_matrix, size_h_global, size_w_global, height_top_bound, height_bottom_bound;
function setupCanvas(){   

    //this will be used to randomly select one of the (two?) cover designs.
    var category = Math.random();
    
    height_top_bound = window.innerHeight/3.0;
    height_bottom_bound = window.innerHeight*2.0/3.0

    is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    //this background will be selected only on desktop and that too with a probability of 0.5
    if( category > 0.5 && !(is_mobile))
    {

        //this removes the floating orb thingies
        document.getElementById("first").remove();
        document.getElementById("second").remove();
        document.getElementById("third").remove();
        document.getElementById("fourth").remove();
        document.getElementById("fifth").remove();
        document.getElementById("sixth").remove();

        //canvas setup
        var c = document.createElement('canvas'),        
        ctx = c.getContext('2d'),
        size_h = c.height = window.innerHeight;
        if(is_mobile)
        {
            size_h = c.height = window.innerHeight/3.0;
        }
        size_w = c.width = window.innerWidth;
        size_h_global = size_h;
        size_w_global = size_w_global;
        //grid variables
        var x_increment = 60.0;
        var y_increment = 50.0;
        if(is_mobile)
        {
            x_increment = 90;
            y_increment = 90;
        }
        //random initialization of nodes.
        var nodes = [];
        new_node = new node(25, 0);
        nodes.push(new_node);
        var prob = 0.18;
        for(var x = 25; x < size_w - 25; x += x_increment)
        {
            for(var y = height_top_bound; y < height_bottom_bound - 25.0; y += y_increment)
            {
                if(Math.random() < prob)
                {
                    new_node = new node(x, y);
                    nodes.push(new_node);
                }
                
            }
        }
        new_node = new node(size_w - 25, 0);
        nodes.push(new_node);

        //setup of the directed adjacency matrix
        var adj = new Array(nodes.length);
        for(var i = 0; i < nodes.length - 1; i++)
        {
            var count = 0;
            var j_array = new Array(nodes.length);
            for(var j = 1; j <= 2 && i + j < nodes.length; j++)
            {
                if(Math.random() > 0.1)
                {
                    j_array[i+j] = 1;
                    count++;
                }
            }
            //this is to ensure graph remains connected
            if(count == 0)
            {
                var j = Math.floor((Math.random()*4 + 1));
                j_array[i + j] = 1;
                count++;
            }
            //last vertex will be connected to second last one
            if(i == nodes.length - 2)
            {
                j_array[nodes.length - 1] = 1;
            }
            adj[i] = j_array;
        }
        adj[nodes.length - 1] = [];

        //making these global
        node_list = nodes;
        adj_matrix = adj;
        
        //main animation loop
        make_frame(ctx, c);
    }
    
}
    
class node
{
    constructor(x, y)
    {
        //setting point's coordinates
        this.x = x;
        this.y = size_h_global/2.0;

        //setting point's velocity
        this.dy = Math.random()*4 + 0.5;
        if(Math.random() > 0.5)
        {
            this.dy = -this.dy;
        }
        //offseting it a little
        this.y += this.dy;
        this.x += Math.random()*10 - Math.random()*10;
    }
}

//this will plot a line
function plot_node(node, ctx)
{
    ctx.beginPath();
    //ctx.fillStyle = "#003d66";
    ctx.fillStyle = "rgba(23, 87, 171, 0.9)";
    ctx.arc(node.x, node.y, 2.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

//this will plot a line between two nodes
function plot_line(node1, node2, ctx)
{
    ctx.beginPath();
    ctx.moveTo(node1.x, node1.y);
    ctx.lineTo(node2.x, node2.y);
    ctx.strokeStyle = "rgba(23, 87, 171, 0.9)";
    ctx.stroke();
}

//this will move the node and reverse velocity based on its position
function update_node(node, ctx)
{
    node.y += node.dy;
    if(node.y > size_h_global  * 3 / 4 + 25.0)
    {
        node.dy = - Math.abs(node.dy);
    }
    if(node.y < size_h_global / 4 - 25.0)
    {
        node.dy = Math.abs(node.dy);
    }
}



function make_frame(ctx, c)
{
    function animate()
    {
        //ctx.clearRect(0, 0, c.width, c.height);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, c.width, c.height);  
        
        //this shall move all the nodes
        for(var i = 0; i < node_list.length; i++)
        {
            update_node(node_list[i]);
        }

        //this will plot all the nodes and edges
        for(var i = 0; i < node_list.length; i++)
        {
            plot_node(node_list[i], ctx);
            
            for(var j = 0; j < node_list.length; j++)
            { 
                if(adj_matrix[i][j] == 1)
                {   
                    plot_line(node_list[i], node_list[j], ctx);
                }  
            }
        }
        //this will set the new frame
        document.body.style.background = 'url(' + c.toDataURL() + ')'; 

        //don't call it a c̶o̶m̶e̶b̶a̶c̶k̶  callback
        requestAnimationFrame(animate);
    };

    //start loop
    animate();
}