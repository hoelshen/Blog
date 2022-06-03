// 原始 xml
const xml = `
<list>
  <item>content1</item>
  <item>content2</item>
  <item>content3</item>
  <item>
    <name>hema</name>
    <value>frontend</value>
  </item>
</list>
`;

// 目标 json
const json = {
  tag: "list",
  children: [
    {
      tag: "item",
      children: "content1",
    },
    {
      tag: "item",
      children: "content2",
    },
    {
      tag: "item",
      children: "content3",
    },
    {
      tag: "item",
      children: [
        {
          tag: "name",
          children: "hema",
        },
        {
          tag: "value",
          children: "frontend",
        },
      ],
    },
  ],
};

function xml2json(xml) {
  let result;

  // TODO: your code here
  // A coding exercise of implementing a XML parser
  // Caution: this is not a full implementation. Some features(ex. self-closing tag) are not implemented.
  // Further tests need to be done

  var i = 0;
  var ch = xml[i];
  var focusedNode;
  function next(c) {
    if (c) {
      if (c == ch) {
        i++;
        ch = xml[i];
      } else {
        throw new Error(`${c} is expected at ${i}.`);
      }
    } else {
      i++;
      ch = xml[i];
    }
  }

  function leftAngle() {
    next("<");
  }

  function rightAngle() {
    next(">");
  }

  function equal() {
    next("=");
  }

  function quote() {
    next('"');
  }

  function slash() {
    next("/");
  }

  function hyphen() {
    next("-");
  }

  function exclamation() {
    next("!");
  }

  function whitespace() {
    while (ch && /\s/.test(ch)) {
      next();
    }
  }

  function word() {
    var result = "";
    while (ch && /[^\">]/.test(ch)) {
      result += ch;
      next();
    }
    return result;
  }

  // similar to above, but will reject string with space in between
  function identifier() {
    var result = "";
    while (ch && /[^\"> =]/.test(ch)) {
      result += ch;
      next();
    }
    return result;
  }

  // similar to above, but will stop accepting new characters when a '<' is encountered
  // for accepting inner text content between tags
  function innerText() {
    var result = "";
    while (ch && ch != "<") {
      result += ch;
      next();
    }
    return result;
  }

  // accepting function for contents in a comment tag.
  // For terminating acception of this tag, a 3-character lookahead is required
  function commentWord() {
    var result = "";
    while (ch) {
      if (xml[i + 1] == "-" && xml[i + 2] == "-" && xml[i + 3] == ">") {
        result += ch;
        next();
        break;
      } else {
        result += ch;
        next();
      }
    }
    return result;
  }

  function opentag() {
    leftAngle();
    var tagName = identifier();
    whitespace();
    if (xml[i] != ">") {
      var attrArray = attrs();
    }
    whitespace();
    rightAngle();
    return {
      tag: tagName,
      attr: attrArray,
      isComment: false,
    };
  }

  function closetag() {
    leftAngle();
    slash();
    var tagName = identifier();
    rightAngle();
    return {
      tag: tagName,
      isComment: false,
    };
  }

  function text() {
    var content = innerText();
    return new Node({
      isText: true,
      content: content,
    });
  }

  function attrkey() {
    return identifier();
  }

  function attrvalue() {
    quote();
    var value = word();
    quote();
    return value;
  }

  function attr() {
    var key = attrkey();
    equal();
    var value = attrvalue();
    return [key, value];
  }

  function attrs() {
    var attrArray = [];
    while (ch && ch != ">") {
      var _attr = attr();
      whitespace();
      attrArray.push(_attr);
    }
    return attrArray;
  }

  function Node(options) {
    this.tag = options.tag;
    this.attr = options.attr;
    this.children = [];
    this.direction = options.direction;
    this.content = options.content;
    this.isComment = options.isComment;
    this.isText = options.isText;
  }

  function node(parent) {
    var tag;
    var isCloseTag = false;
    if (ch && ch == "<") {
      if (xml[i + 1] && xml[i + 1] == "/") {
        isCloseTag = true;
        tag = closetag();
      } else if (xml[i + 1] && xml[i + 1] == "!") {
        tag = comment();
      } else {
        tag = opentag();
      }
    }
    return new Node({
      tag: tag.tag,
      attr: tag.attr,
      parent: parent,
      isComment: tag.isComment,
      content: tag.content,
      isText: false,
      direction: isCloseTag ? "close" : "open",
    });
  }

  function comment() {
    leftAngle();
    exclamation();
    hyphen();
    hyphen();
    var content = commentWord();
    hyphen();
    hyphen();
    rightAngle();
    return {
      isComment: true,
      content: content,
    };
  }

  function parse() {
    whitespace();
    if (!xml[i]) {
      return;
    } else if (xml[i] == "<") {
      var _node = node();
      return _node;
    } else {
      var _text = text();
      return _text;
    }
  }

  var virtualRootNode = new Node({});
  focusedNode = virtualRootNode;
  var nodeStack = [virtualRootNode];

  whitespace();
  while (i < xml.length) {
    var parsedNode = parse();
    if (parsedNode) {
      if (parsedNode.isComment || parsedNode.isText) {
        focusedNode.children.push(parsedNode);
      } else if (parsedNode.direction == "open") {
        focusedNode.children.push(parsedNode);
        focusedNode = parsedNode;
        nodeStack.push(parsedNode);
      } else if (parsedNode.direction == "close") {
        if (nodeStack[nodeStack.length - 1].tag == parsedNode.tag) {
          nodeStack.splice(-1);
          focusedNode = nodeStack[nodeStack.length - 1];
        } else {
          throw new Error(
            `The closing tag '${parsedNode.tag}' is not matched at ${i}`
          );
        }
      }
    }
  }
  virtualRootNode.children.push(parse());
  virtualRootNode.children.pop();
  whitespace();
  return virtualRootNode.children;
}
console.log(xml2json(xml));
// console: true
console.log(JSON.stringify(xml2json(xml)) === JSON.stringify(json));
