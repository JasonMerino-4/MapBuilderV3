# Map-Builder-V2

<h1>How to Use</h1>

Prep:  
  Make sure you have all of the following files together in a folder, index.html, mapstyle.css, scripts.js, style.css
  Prep your floorplans with file types that are compatible with the \<img> tag. Place it with the same folder.
  Open up VSCode and install Live Server Extension, then open up the index.html file and use Live Server to "Go Live"

****Building the map:****
  1) In _Img File_ Path input the path and filename + file extension. Only type the path starting from where this sites folder is. Ex: \Map Builder\BuildingFloorPlan.png
  2) In _Img Width_ input how wide your img should be. You can edit this later and all nodes on the img will scale accordingly. For reference the img will display over the green grid, each grid box is 100px x 100px
  3) Creating a Node/Room, First select a shape from the _Shape dropdown_. In _Room_ input the roomnumber, this is a string so characters are also accepted. Then press enter key or use the _Add_ button. Your new node with appear on the top left of the img. Nodes will receive focus on creation.
  4) Positioning a Node by clicking, click on the img where you want the node to be.
  5) Position with arrow keys, click outside the floorplan img to avoid img scrolling. Now the arrow keys will move the node left, up, right and down 1px on input
  6) Reselecting a node, to edit and existing node on the map just click it and it will be focused.
  7) _Rotation, Width, Height_ inputs available and use them as needed to edit a selected node.
  8) Deleting a node, select the node you wish to delete on the img/floorplan. The click the _Delete_ button

  Use the site to place all room nodes accordingly on the floorplan once complete you can convert img dimensions and all node data into one string using the console. 
  img dimensions are used to scale nodes in case your wondering.

Using the Console:  
  1) Load, input a previous map data string into the console and click Load to continue your work / load all nodes onto the screen. WARNING: If console is empty and Load is clicked all nodes on the map will be wiped  
  2) Update/String Conversion, click Update to output all map data onto the console. This string contains img dimensions and a list of all map data (Node objects with room number, coords and dimensions)

<h1>Creating the Room Locator Site</h1>
<a href = "https://github.com/JasonMerino-4/MapSite-Template">Multi Building template</a>
<p>I left some notes on the readme for the template, modify the template as you need</p>



<h1>Why this Tool was made</h1>
    
**The problem:** Finding rooms in a multifloor large building is tedious.
**Solution:** Using building floorplans, let the user input a room number and change the img src to the according floorplan and highlight the room.

**How do we create this functionallity?**

Use \<map> and \<area> html elements and use any of the online Image Map tools.
Issues with this:   
                  No built in scaling/responsiveness  
                  Messy HTML  
                  All /<area> elements will need to load, we only need the user room number input to load  
                  Not built for this purpose  

**Alternatively Recreate \<map> \<area> functionality using \<div> \<img> and css:**
  
  Nest an img inside a container div and set the div's position attribute to relative. That container will function as the \<map>
  Next nest a \<div> within that container div from before. We'll use this div as a node to define a room number's area on the map.
  To do so this node div's css position attribute must be absolute. This \<div> node can now be used like an \<area> element by
  positioning the div using the top: and left: attributes

We've recreate \<map> \<area> funcionallity now lets resolve those issues from before    
  
**Only load one html element:** Since our map data is stored as a string we can read the string until we find the room number along with its data, we recreate the \<div> using that data.  
**Cleaner HTML:** No HTML is shown, all room locations are added through javascript. If a new room number is inputted the previous inputted rooms the according div is deleted.  
**Scaling:** The original img dimensions are stored in the map data, using this we scale node coordinates and dimensions using by calculating the change in aspect ratio between the current img and the original img


    


    

      

  
  

  
