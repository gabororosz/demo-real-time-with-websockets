var dragSrcEl = null;

function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    dragSrcColNo = this.getAttribute("class").split(' ')[1];

    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');

        socket = socket || io.connect('http://localhost:8080');
        var dragTrgColNo = this.getAttribute('class').split(' ')[1];
        socket.emit('my other event', { from: dragSrcColNo, to: dragTrgColNo });
    }

    return false;
}

function handleDragEnd(e) {
    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
}

var cols = document.querySelectorAll('#columns .column');
[].forEach.call(cols, function(col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', handleDragEnter, false)
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
});

var socket = socket || io.connect('http://localhost:8080');
socket.on("news", function(data) {
    var fromElems = document.getElementsByClassName(data.from);
    var fromElem = fromElems[0];
    var toElems = document.getElementsByClassName(data.to);
    var toElem = toElems[0];

    var tempElem = fromElem.innerHTML;
    fromElem.innerHTML = toElem.innerHTML;
    toElem.innerHTML = tempElem;
});
