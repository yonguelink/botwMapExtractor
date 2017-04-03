# Zelda BotW map extractor

Extract's and rebuilds a full map of zelda BotW interactive maps (any)

Actually could probably extract any map of any size as long as their files follows the pattern "X-Y", where X and Y are sequential numbers

## How to use

You need to install [GraphicMagick](http://www.graphicsmagick.org/) for the image stitching

Simply run `npm install` and `npm start` to run the tool

Read the first few lines (for now) to see the "parameters" you can give it (hardcoded, for now).


## WARNING

In the `main.js` file, I reference IGN and Zelda Dungeon as potentials sources BUT this essentially steals their content.
Don't abuse this little tool.

Once I'm done I'll include the map resulting from both sources in this repo (given they aren't too large).