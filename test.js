class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    console.log(new.target)
    // ...
  }
}

class Square extends Rectangle {
  constructor(length, width) {
    super(length, width);
  }
}

var obj = new Square(3); // 输出 false