#/bin/bash

echo "You need to have installed lessc"
echo "To do that: 'npm install less -g'"
echo ""

echo "Compiling all main.less files to main.css"
lessc main.less main.css
echo "Done"
echo ""

echo "Moving main.css to css folder"
mv main.css ../css/main.css
echo "Done"
