##Connect4

Connect4 is a web version of a very famous logical board game.
##Install

To install the game use the following npm package:

`$ npm install connect-4`

Or download the library from the github project: https://github.com/VRymarovich/connect4.git.

##Start game

To start game add this tag with `id="connect"`:
`<div id="connect4"></div>`.


Then inside the `<script>` tag add the following code:

```javascript
var options = {'horizontal': 7,
                'vertical': 6,
                'players': [{'name':'Ironman', 'color':'red'}, 
                            {'name':'Superman', 'color':'yellow'}]};
var connect4 = new Connect4(options);
connect4.start();
```
##Options

Options consist of the following attributes:


1. `'horizontal'` - defines the number of columns in the field.


2. `'vertical'` - defines the number of rows in the field.


3. `'players'`. This object defines the names of the players which are displayed in the field and its cells color. If you change the name of the color you should also create new class in css file `connect4.css`


##Example

See working example at:
https://vrymarovich.github.io/
