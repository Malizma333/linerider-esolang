TODO:
- Create userscript
- Create example "programs" (tracks)
- Example program videos running
- Credits/Notes ending section?
- Get instruction set reviewed
- Get writing style reviewed
- Publish to github (and possibly portfolio blog?)

# The Line Rider Esolang

## What the heck is Line Rider?

From [the Wikipedia article](https://en.wikipedia.org/wiki/Line_Rider):

> Line Rider is a browser game or software toy ... originally created in September 2006 by Boštjan Čadež.

The idea behind Line Rider is simple - draw something on the canvas and a boy on a sled will ride on your drawing, falling off his sled if he hits it too hard. Line Rider's simplicity and approachability as a physics toy caused it to gain widespread appeal. Users would often spend hours create courses for this sledder to ride along, setting challenges to make longer and longer courses without causing the sledder to fall off. This led to the formation of a niche community of users dedicated to creating and sharing these courses (or "tracks," as they are referred to by community members) with each other.

Often, inner members of this community wanted to impress each other with cooler and cooler "tricks" that could keep the rider on the sled, gamifying the original concept. This posed questions about what sorts of tricks could be done without making the sledder fall off. How fast could the sledder go? What was the maximum speed that the sledder could hit a line and "survive"? Why would he sometimes fall through drawings? In searching for the answers to these questions, members of this community made a bunch of bizarre discoveries about how Line Rider's physics engine works.

## The "quirkiness" of Line Rider's physics engine

Line Rider's physics is unusual, to say the least.

There are two physics lines, red lines in blue lines. Blue lines are your standard collision lines that have no special effects. Red lines cause the sledder to accelerate in some direction based on an internal multiplier value.¹ There are also decorative green lines that play no role in the physics engine.

Things start to become strange when looking at properties of the underlying physics engine. Some of the more notable properties² include the following:

- The physics engine is deterministic and runs at 40 frames per second.
- The sledder is made of exactly 10 "contact points" that determine how the sledder interacts with physics lines.
- These points are connected by "bones" that have a level of tension allowed before they break and cause the sledder to fall off.
- Lines have one-sided, finite hitboxes that pull contact points to the surface of the line.
- Friction exists, but only certain contact points create it to varying degrees.
- Each frame can be broken into a momentum tick followed by sixth iterations, the last of which the rider can survive almost anything.

Because these properties are so unlike those of any other physics engine, the community decided to name tricks that utilize these strange behaviors "quirks." The overall genre of tracks made with these tricks has come to be known as "quirk." Since then, many different labels of tricks have been created in attempts to categorize tricks into one or more subgenre of quirk. One such subgenre will be used as the foundation of the Line Rider Esolang.

## Using "XY quirk" to define an instruction set

A subgenre of quirk dubbed "XY quirk" consists of tricks performed with strictly vertical and horizontal lines. We will utilize the restricted nature of lines in XY quirk to form a limited instruction set based on each line's rotation and type, with the goal of making these sorts of tracks perform computation.

The following image shows each permutation of line that can be used under the restrictions of XY quirk. Each of these permutations will be mapped to a corresponding instruction. Red lines will be given two instructions that depend on the sign of the red line's multiplier, for reasons given later.

![An image with four rotations listed at the top. The four rotations listed are 0 degrees, 90 degrees, 180 degrees, and 270 degrees. Below each rotation is a blue line with a gray box drawn along the line. For 0 degrees, the line is drawn horizontally and the gray box is below the line. For 90 degrees, the line is drawn vertically and the gray box is drawn to the right of the line. For 180 degrees, the line is drawn horizontally and the gray box is drawn above the line. For 270 degrees, the line is drawn vertically and the gray box is drawn to the left of the line. Below each blue line is a corresponding red line with a gray box drawn in the same orientation.](assets\line_rotation_visual.png "Line Rotations")

## Defining the instruction set

We define the instruction set from the 8 possible lines as follows.

<table markdown="1">
  <tr>
    <th>Rotation</th>
    <th>Blue Line Behavior</th>
    <th>Red Line Behavior, Positive M</th>
    <th>Red Line Behavior, Negative M</th>
  </tr>
  <tr>
    <td>0°</td>
    <td>Clear the instruction buffer and start interpretation³</td>
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
    <td>Halt interpretation and evaluate the instruction buffer³</td>
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

The instructions corresponding to red lines depend on the internal multiplier, M, of the red line. The magnitude of the multiplier determines the strength of the instruction, and the sign of the multiplier determines the behavior.

Blue line instructions have completely different functionality from their red line counterparts. This choice was made based on the fact that blue lines are, in essence, red lines with 0 multiplier, a value that would have no effect on any of the red line defined instructions.

While this table is useful for defining the instruction set, we have not yet specified how it should be interpreted into a runnable program. To actually apply these instructions, an interpreter is introduced that checks for rider-line collisions while the track is running. The interpreter's job is to figure out which permutation of line is being hit on the current frame, translate that permutation into its corresponding instruction, and append the instruction to a buffer that keeps track of all of the instructions found so far.

The interpreter only begins adding to the buffer once the line corresponding to the start instruction is hit. Once the line corresponding to the halt instruction is hit, the interpreter stops adding instructions to the buffer, then evaluates the program in the buffer sequentially.

## Some example programs

With the definitions and logistics out of the way, we can now "write" some functional programs using these instructions. Below are some examples of tracks that run programs commonly used for examples.

[This track]() gets interpreted into a program that prints hello world.

*(Video here)*

[This track]() gets interpreted into a program that calculates the nth fibonacci number, where n is the input.

*(Video here)*

## Creating your own program

I've written a userscript for the web version of Line Rider that acts as the interpreter by detecting physics collisions and translating them into the appropriate instructions. Below are some steps to setup this userscript for testing your own Line Rider Esolang programs.

1) Install a browser extension that supports userscript execution, such as [Tampermonkey](https://www.tampermonkey.net/).
2) Install [the userscript](https://github.com/Malizma333/linerider-esolang/raw/main/line-rider-esolang-interpreter.user.js) to run the interpreter.
3) Make a track at [linerider.com](https://www.linerider.com/) and watch your program run from the developer console!

## Credits and footnotes


¹ *This internal multiplier value takes the range of real numbers between -256 to 255, and was only a recent addition to more modern versions of Line Rider.*

² *While not all of these tidbits are crucial to understanding the rest of this article, they are still an interesting example that intricate systems come together to form seemingly regular behaviors.*

³ *These are meta instructions that define when to start and stop the interpreter. They do not affect the actual program functionality itself.*