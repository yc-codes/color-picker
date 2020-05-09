
const textBoxes = document.getElementsByClassName('textBox');
const textAreaField = document.getElementById('textarea-field');

const colorsContainer = document.getElementById('colors-container');
const colorBlock = document.getElementById('colors-block');
const colorBox = document.getElementById('color-box');

const colorElements = document.getElementsByClassName('color');

let selectedColor = '#0066ff';

let colorsList = [];
colorsList = colorsList.concat(flatcolorsui);

const hiddenDiv = document.createElement('div');

hiddenDiv.classList.add('master-input');
hiddenDiv.classList.add('w-100');
hiddenDiv.classList.add('text-break');

document.addEventListener("DOMContentLoaded", function () {
    colorsList.forEach(colors => {
        const colorBlockClone = colorBlock.content.cloneNode(true);

        colors.forEach(color => {
            const colorBoxClone = colorBox.content.cloneNode(true);
            colorBoxClone.children[0].style.backgroundColor = color;
            colorBlockClone.children[0].appendChild(colorBoxClone);
        });

        colorsContainer.appendChild(colorBlockClone.children[0]);
    });

    Array.from(colorElements).forEach(colorElement => {
        colorElement.addEventListener('mouseover', () => changeColor(colorElement.style.backgroundColor));
        colorElement.addEventListener('mouseout', () => {
            changeColor(selectedColor)
            clearToolTip(colorElement);
        });
        colorElement.addEventListener('click', async () => {
            selectedColor = colorElement.style.backgroundColor;
            copyToClipboard(rgbToHex(selectedColor), colorElement);
            removeAllActiveColors();
            colorElement.classList.add('active');
            changeColor(selectedColor);
        });
    });
});

textAreaField.addEventListener('input', (event) => {
    changeTextBoxesText(event.target.value);
    textAreaAutoResize(event);
});

function removeAllActiveColors() {
    Array.from(colorElements).forEach(colorElement => {
        colorElement.classList.remove('active');
    });
}

function changeColor(color) {
    textAreaField.style.color = color;
    Array.from(textBoxes).forEach((textBox, index) => {
        if (index === 0 || index === 1) {
            textBox.style.color = color;
        } else {
            textBox.style.backgroundColor = color;
        }
    });
}

async function copyToClipboard(color, colorElement) {
    if (!navigator.clipboard) {
        // Clipboard API not available
        return false;
    }
    try {
        await navigator.clipboard.writeText(color);
        colorElement.setAttribute('tooltip', "Copied: " + color);
        return true;
    } catch (err) {
        console.error('Failed to copy!', err)
        return false;
    }
}

function clearToolTip(colorElement) {
    colorElement.setAttribute('tooltip', "Copy to Clipboard");
};

function textAreaAutoResize(event) {
    textAreaField.parentNode.appendChild(hiddenDiv);
    textAreaField.style.resize = 'none';
    textAreaField.style.overflow = 'hidden';
    content = textAreaField.value;
    content = content.replace(/\n/g, '<br>');
    hiddenDiv.innerHTML = content + '<br style="line-height: 3px;">';
    hiddenDiv.style.visibility = 'hidden';
    hiddenDiv.style.display = 'block';
    textAreaField.style.height = hiddenDiv.offsetHeight + 'px';
    hiddenDiv.style.visibility = 'visible';
    hiddenDiv.style.display = 'none';
};

function changeTextBoxesText(text) {
    Array.from(textBoxes).forEach((textBox) => {
        textBox.innerText = text;
    });
}

function rgbToHex(col) {
    if (col.charAt(0) == 'r') {
        col = col.replace('rgb(', '').replace(')', '').split(',');
        var r = parseInt(col[0], 10).toString(16);
        var g = parseInt(col[1], 10).toString(16);
        var b = parseInt(col[2], 10).toString(16);
        r = r.length == 1 ? '0' + r : r; g = g.length == 1 ? '0' + g : g; b = b.length == 1 ? '0' + b : b;
        var colHex = '#' + r + g + b;
        return colHex;
    }
    return col;
}