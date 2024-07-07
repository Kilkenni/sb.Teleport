interface Tab {
  id : string, // Optional. Tab's unique identifier; if not specified, will be populated with a UUID.
  title : string, // The tab's displayed title.
  icon : string, // The tab's icon; 16x16 or smaller.
  visible : boolean, // Whether the tab widget itself is visible. Same rules as on widgets.
  color : string, // The accent color of the tab in HEX format.
  contents : metagui.widget[ ], // The contents of the tab's connected page.
}

declare module metagui {
  const inputData: {[key: string]: unknown}|undefined;

  interface widget {
    type: string; //As you'd expect, the type of widget. Case sensitive; generally in camelCase.
    id?: string; //Key of the widget's global reference; if omitted, none is created.
    position?: Vec2I; // Explicit position; ignored in automatic layouts. Top to bottom, left to right.
    size?: Vec2I; // Explicit size.
    expandMode? : Vec2I; // Only available for some widget types; how eager the widget is to expand on each
    // axis. 0 is fixed size; otherwise widget will expand if none in the layout have higher priority.
    visible? : boolean; // When false, widget is hidden and excluded from layout calculations.
    toolTip? : string; // Self explanatory. Can be multiple lines.
    data? : { [key: string] : unknown }; // Arbitrary JSON data. Mostly useful for script-built panes.

    center(this: void):Vec2I; //Returns the widget's center position.
    queueRedraw():void;
    queueGeometryUpdate():void;
    relativeMousePosition():unknown; //FIXME
    setVisible(boolean):unknown; //FIXME
    addChild(widget: unknown) //Only recommended to use on layout, panel, or scrollArea.
    clearChildren(): unknown;
    delete():unknown;
    findParent(widgetType: string) //Find most immediate parent of a specific type.
    subscribeEvent(name:string, func: Function) //Subscribe to a named event on behalf of a widget.
    pushEvent(name: string, ...$vararg) //Push event to widget with given parameters. FIXME for TSTL
    //Checks self first, then each child. If own event gives a "truthy" value, immediately returns it;
    //if a child event gives one, it only short-circuits if it's nonboolean.
    broadcast(name:string, ...$vararg) //Push event to widget's parent (and likely siblings).
    wideBroadcast(level: unsigned, name: string, ...$vararg) //Same as broadcast, but from specified number of levels up.
  }

  interface Layout extends widget {
    type: "layout",
    mode?: "horizontal"|"h"|"vertical"|"v"|"stack"|"manual", // How the layout arranges its children. Defaults to manual if explicitly declared.
    // "horizontal", "vertical" ("h", "v"): Automatically arranges children in a row or column.
    // "stack" : Children are stacked on top of each other and expanded to fit layout space.
    // "manual": Children are explicitly placed; layout expands to fit.
    spacing? : unsigned, // Spacing between child elements in automatic layout modes, in pixels. Defaults to 2px.
    align? : number, // Proportion of alignment for fixed-size children on opposite axis in automatic modes.
    // 0 is aligned with left or top edge; 1 with bottom or right. Defaults to 0.5 (centered).
  }

  /**
   * Essentially a layout with a background.
   */
  interface Panel extends widget {
    type: "panel",
    style? : "convex"|"concave"|"flat", // Default: "convex"
    padding? : unsigned, // Internal padding, added to the default two-pixel edge.
  }

  /**
   * Another layout-proxy, this time with drag-scrolling; left or right click for touch-style "fling" scrolling, middle click for "thumb" (absolute) mode. As of Beta v0.1.2, full scroll wheel support is included.
   */
  interface ScrollArea extends widget {
    type: "scrollArea",
    scrollDirections? : [0|1, 0|1], // Whether the contents can be scrolled on each axis. Default: vertical ( [0,1] )
    scrollBars? : boolean, // Whether to show scroll bars after scrolling. Defaults to true.
    thumbScrolling? : boolean, // Whether "thumb" (absolute) scrolling is enabled. Defaults to true.

    scrollBy(vec: unsigned, suppressAnimation?: boolean) //Attempts to scroll contents by [vec] pixels. Shows scroll bars if suppressAnimation is false or omitted.
    scrollTo(pos: number, suppressAnimation?: boolean, raw?: boolean) //Attempts to center viewport on [pos]. Shows scroll bars if suppressAnimation is false or omitted. If raw is specified, sets raw position instead of centering.
  }

  interface TabField extends widget {
    type: "tabField",
    layout : "horizontal"|"vertical", // Which direction the tabs run. "horizontal" is a bar across the top, "vertical" is a sidebar down the left side.
    tabWidth? : unsigned, // If using vertical layout, how wide the tabs are. (Horizontal tabs fit to contents.)
    noFocusFirstTab? : boolean, // If true, prevents the first tab created from being automatically selected. Useful for cases where tab contents are loaded on first viewing, such as the settings panel. Default: false
    tabs : Tab[], // An array of tabs, formatted as follows:
    bottomBar : widget[], // Contents of an optional bar below the contents. Mostly useful for vertical tab layout.

    newTab(parameters: Tab):Tab; //Creates a new tab. Parameters are as in the "tabs" attribute. Returns a tab object.
    select():unknown; //Switches to tab.
    setTitle(title: string, icon?: string):unknown; //Changes the tab's title and (optionally) icon.
    setColor(color:string):unknown; //Changes the tab's accent color.
    setVisible(bool:boolean): unknown;

    //events
    onTabChanged(tab, previous) //Called on changing tabs.
  }

  /**
   * Empty space used to add single margins/paddings manually between widgets or center children in layouts
   */
  interface Spacer extends widget {
    type: "spacer",
  }

  /**
   * A simple text display.
   */
  interface Label extends widget {
    type: "label",
    text : "Hello ^accent;world^reset;!", // The text to display. Supports formatting codes.
    fontSize? : unsigned, // Defaults to 8.
    color? : string, // The unformatted text color, either "accent" or a hexcode.
    align? : "left"|"center"|"right", // Horizontal alignment. Defaults to "left".
    inline? : boolean, // If true, makes label fixed-size.
    expand? : boolean, // If true, gives (horizontal) expansion priority.
    wrap? : boolean, // Default: true. If false, disables word wrap.

    setText(text:string)
  }
  
  /**
   * A simple image display. Centers image within widget area if given explicit size.
   */
  interface Image extends widget {
    type: "image",
    file : string, // The image to display. Can be absolute or relative (to the pane!).
    scale? : unsigned, // Default: 1. Scale proportion for the image.
    noAutoCrop? : boolean, // Default: false. When true, preserve empty space in image margins; otherwise, behavior matches vanilla images.

    setFile(path: string)
    setScale(value: unsigned)
  }

  /**
   * A raw canvas. Override draw() and optionally the various mouse functions to use.
   */
  interface Canvas extends widget {
    type: "canvas",

    //Shorthand for widget.bindCanvas(canvas.backingWidget)
    bind();
  }

  interface Button extends widget {
    type: "button",
    caption? : string, // Text to draw on the button.
    captionOffset? : Vec2I, // Pixel offset for caption.
    color? : string, // Accent color. Rendering dependent on theme.

    //Sets the button's caption.
    setText(string) 

    //Called when button released after pressing (left click).
    onClick() 
  }

  /**
   * A button that renders as a given icon.
   */
  interface IconButton extends widget {
    type: "iconButton",
    image: string, // The idle image to use. If suffixed with a colon (image.png:), file is treated as a sprite sheet with the frames "idle", "hover" and "press". Relative or absolute paths accepted.
    hoverImage: string,
    pressImage: string,

    setImage(this: void, idle: string, hover: string, press: string) //Sets the button's icon drawables.

    //Called when button released after pressing (left click).
    onClick() 
  }

  /*
  interface CheckBox extends widget {
    A check box. Uses the same onClick event as the button types.
    "checked" : true, // Pre-checked if specified.
    "radioGroup" : "mode", // If specified, widget becomes a radio button grouped with others of its group.
    "value" : 23, // Any data type. Used by radio buttons.

    checkBox:setChecked(b)
    local bool = checkBox.checked
    checkBox:getGroupChecked() //If widget is a radio button, returns the checked widget of its group.
    checkBox:getGroupValue() //Same as above, except returns the widget's value attribute.
    checkBox:findValue(val) //If widget is a radio button, returns its sibling with given value if it exists.
    checkBox:selectValue(val) //Same as above, but sets the specified sibling checked.
  }
  */

  /**
   * A text entry field.
   */
  interface TextBox extends widget {
    type: "textBox",
    text: string, //SHOULD BE PRIVATE
    caption? : string, // Text to display when unfocused and no text is entered.
    color? : string, // Text color.
    inline? : boolean, // Alias for an expandMode of [0, 0].
    expand? : boolean, // Alias for an expandMode of [2, 0].

    focus() //Grabs keyboard focus.
    blur() //Releases focus.
    setText(text: string) //Sets contents.
    setColor(color: string) //Sets text color in HEX format.

    setCursorPosition(pos: int) //Sets the position of the text cursor, in characters.
    moveCursor(pos: int) //Moves the cursor by a given number of characters.
    setScrollPosition(pos: int) //Sets how far the text field is scrolled, if contents overflow.

    //events
    onTextChanged() //Called on any change to the entered text.
    onEnter() //Called when unfocused by hitting enter.
    onEscape() //Called when unfocused by hitting escape.
  }

  /**
   * A list item; essentially a layout, selectable by mouse click. Deselects siblings when selected. 
   * Also available under type menuItem with behavior modified accordingly.
   */
  interface ListItem extends widget {
    type: "listItem",
    buttonLike? : boolean, // Default: true. Flag for theme use; by default, indicates that the item should make a sound when clicked, e.g. a context menu item.
    //Implicit for menuItems.
    noAutoSelect? : boolean, // Default: true. When true, list item will not be automatically set as selected when clicked.
    // Implicit for menuItems.
    selectionGroup? : string, // Selecting a menu item will only automatically deselect siblings with the same selection group (nil included).

    select()
    deselect()

    //events
    onSelected()
    onClick(button)
  }
  //TODO add the rest

  //GENERAL METHODS

  /**
   * Asset path relative to the current pane.
   * @param path 
   */
  function path(path: string):unknown;

  /**
   * Asset path relative to the theme. If .png, searches for fallback if not found.
   * @param path 
   */
  function asset(path: string):unknown;

  /**
   * Sets the window title.
   * @param newTitle 
   */
  function setTitle(newTitle: string):unknown;

  /**
   * Sets the window icon.
   * @param path Full path in assets starting with / is recommended. Otherwise tries to search in the same folder.
   */
  function setIcon(iconPath: string):unknown;

  /**
   * Marks the window decorations for redraw.
   */
  function queueFrameRedraw():void;

  /**
   * Starts an event with the specified parameters.
   * @param func 
   * @param $vararg 
   */
  function startEvent(func: Function, ...$vararg):unknown;

  /**
   * Broadcasts a named event to the entire window with specified parameters.
   * @param name 
   * @param $vararg 
   */
  function broadcast(name: string, ...$vararg):unknown;

  /**
   * Registers a function to be called on window exit.
   * @param func 
   */
  function registerUninit(func: Function): unknown;

  /**
   * Opens a context menu with a list of elements: {name, function}. A separator can be placed by inserting the string "separator".
   * @param list 
   */
  function contextMenu(list: ([string, Function] | "separator")[]):unknown; //

  /**
   * Attempts to create a metaGUI widget from the given definition table.
   * @param def 
   * @param parent 
   * @returns Returns the widget table, or nil if one could not be created.
   */
  function createWidget(def: widget, parent: unknown):widget;

  /**
   * Creates a layout from an array of definitions. Uses the first-element parameter object if present, then a defaults table if provided.
   * @param list 
   * @param parent 
   * @param defaults 
   */
  function createImplicitLayout(list: widget[], parent: unknown, defaults: Layout|Panel|ScrollArea):Layout|Panel|ScrollArea;

  //Makes a new vanilla (backing) widget and returns the full path.
  function mkwidget(parent: unknown, def: widget):string;

  //Turns a pane-relative position into a widget-relative one.
  function paneToWidgetPosition(widget, pos): unknown; 

  //Turns a screen position into a widget-relative one.
  function screenToWidgetPosition(widget, pos):unknown;

  /**
   * @returns Returns true if the player is using an extended client that supports pane resizing.
   */
  function canResize():boolean;

  //Returns the current size of the window; if total is true this includes the frame, otherwise it returns only the internal area.
  function getSize(total) 
  
  //Attempts to resize the window. Does nothing if the client does not support resizing. Behavior of total flag matches getSize.
  function resize(size, total) 
  
  //Returns the character a given keycode should print, or nil if none.
  function keyToChar(keycode, accel):string|null;

  //Check if two item descriptors can stack together.
  function itemsCanStack(item1: ItemDescriptor, item2: ItemDescriptor) 

  /**
   * @param item 
   * @returns Returns the maximum stack size of an item descriptor.
   */
  function itemMaxStack(item: ItemDescriptor):unsigned;

  //Returns how many of an item can fit on the cursor, if any.
  function itemStacksToCursor(item: ItemDescriptor) 

  //Only available in events; checks if player is holding shift.
  function checkShift() 

  //Attempts to determine if player is holding shift through tech hooks only.
  function fastCheckShift() 

  //Checks if sync succeeded with source entity (or entity id if specified). If resync specified, clears sync flag and pings entity.
  function checkSync(resync, id) 
  
  //Same as above, but waits until sync flag set. Only available in events.
  function waitSync(resync, id) 
}