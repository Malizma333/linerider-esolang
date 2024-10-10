# The Line Rider Esolang

## What the heck is Line Rider?

From [the Wikipedia article](https://en.wikipedia.org/wiki/Line_Rider):

> Line Rider is a browser game or software toy ... originally created in September 2006 by Boštjan Čadež.

The idea behind Line Rider is simple - scribble a drawing and a sledder will ride on your drawing as if it was solid ground. Its minimal design and approachable nature led to it becoming a viral success almost overnight. Users would often create courses for the sledder to follow, leading to the formation of a niche community dedicated to creating and sharing these courses (or "tracks") with each other.

Something something breaking physics engine

## The "quirkiness" of Line Rider's physics engine

Something something physics engine is weird

## A brief lesson on Line Rider nomenclature

## Using "XY quirk" to define an instruction set

A subset of quirk dubbed "XY quirk" is defined as quirk performed with lines that are strictly horizontal or vertical. The Line Rider Esolang will utilize the restricted nature of these lines to form a limited instruction set based on each line's rotation and type.

Under the restrictions of XY, a line can only have 2 possible orientations: horizontal or vertical. As discussed earlier, lines only have a hitbox on one particular side, meaning that there are 2 possible sides for their hitbox to be on. Given that there are only 2 physics lines to interact with, this results in a total of 2 * 2 * 2 = 8 total possibilities of lines to create instructions from.

The following image shows each line permutation labeled with its corresponding angle. The angles are determined based on the orientation of the line and location of the hitbox.

![An image with four rotations listed at the top. The four rotations listed are 0 degrees, 90 degrees, 180 degrees, and 270 degrees. Below each rotation is a blue line with a gray box drawn along the line. For 0 degrees, the line is drawn horizontally and the gray box is below the line. For 90 degrees, the line is drawn vertically and the gray box is drawn to the right of the line. For 180 degrees, the line is drawn horizontally and the gray box is drawn above the line. For 270 degrees, the line is drawn vertically and the gray box is drawn to the left of the line. Below each blue line is a corresponding red line with a gray box drawn in the same orientation.](assets\line_rotation_visual.png "Line Rotations")

## Defining the instruction set

We define the instruction set off of the 8 possible lines as follows.

Notice that the instructions corresponding to red lines depend on the magnitude and sign of the multiplier. This makes each red line instruction a function of multiplier M. These instructions were chosen such that a negative sign on the multiplier effectively negated the functionality of the instruction.

Also notice that the blue line instructions have completely different functionality from their red line counterparts. This choice was made based on the fact that red lines of any orientation with a multiplier of 0, which are effectively blue lines, create an instruction with no effect.

<table markdown="1">
  <tr>
    <th>Rotation</th>
    <th>Blue Line Behavior</th>
    <th>Red Line Behavior, Positive M</th>
    <th>Red Line Behavior, Negative M</th>
  </tr>
  <tr>
    <td>0°</td>
    <td>Clear the instruction buffer and start interpretation¹</td>
    <td>Move to the <b>next</b> Mth register</td>
    <td>Move to the <b>previous</b> Mth register</td>
  </tr>
  <tr>
    <td>90°</td>
    <td>Reset current register to 0</td>
    <td><b>Increment</b> current register by M</td>
    <td><b>Decrement</b> current register by M</td>
  </tr>
  <tr>
    <td>180°</td>
    <td>Halt interpretation and evaluate the instruction buffer¹</td>
    <td>Take <b>input</b> into the next M registers, overriding them</td>
    <td><b>Output</b> the value of the next M registers</td>
  </tr>
  <tr>
    <td>270°</td>
    <td>If the value at the current address is zero, jump to the start of the program, else continue execution</td>
    <td>If the value at the current address is zero, relative jump M instructions <b>forward</b>, else continue execution</td>
    <td>If the value at the current address is zero, relative jump M instructions <b>backward</b>, else continue execution</td>
  </tr>
</table>

¹ *These are meta instructions that define when to start and stop program interpretation. They do not affect the actual program functionality itself.*

The way the vertical lines are interpreted into a program is as follows: As the track runs, an interpreter is running in parallel that checks for collisions with each orientation of line on each frame. If a collision with a line is found, it appends the corresponding instruction to the instruction buffer, which is a running list of instructions found so far.

The interpreter only begins adding to the buffer once the line corresponding to the start instruction is hit, as defined above. Once the line corresponding to the halt instruction is reached, the interpreter stops adding instructions to the buffer, then evaluates the buffer sequentially.

## Some example programs

[This track]() gets interpreted into a program that prints hello world.

*(Video here)*

[This track]() gets interpreted into a program that calculates the nth fibonacci number, where n is the input.

*(Video here)*

## Creating your own

I've written a userscript for the web version of Line Rider that detects physics collisions and translates them to the appropriate instructions. Below are some steps to setup this userscript for running your own Line Rider Esolang programs.

1) Install a browser extension that supports userscript execution, such as [Tampermonkey](https://www.tampermonkey.net/).
2) Install [this userscript](https://github.com/Malizma333/linerider-esolang/raw/main/line-rider-esolang-interpreter.user.js) that runs the interpreter.
3) Make a track at [linerider.com](https://www.linerider.com/) and watch your program from the developer console.
