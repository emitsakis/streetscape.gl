// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * Parse LiDar data (stored in velodyne_points dir),
 */

import {Parser as BinaryParser} from 'binary-parser';
const parser = new BinaryParser().floatle();

function readBinaryData(binary) {
  const res = [];
  for (let i = 0; i < binary.length; i = i + 4) {
    if (i + 4 > binary.length) {
      break;
    }
    const parsed = parser.parse(binary.slice(i, i + 4));
    res.push(parsed);
  }
  return res;
}

export function loadLidarData(data) {
  const binary = readBinaryData(data);
  const float = new Float32Array(binary);
  const size = Math.round(binary.length / 4);

  // We could return interleaved buffers, no conversion!
  const positions = new Float32Array(3 * size);
  const colors = new Uint8Array(4 * size).fill(255);

  for (let i = 0; i < size; i++) {
    positions[i * 3 + 0] = float[i * 4 + 0];
    positions[i * 3 + 1] = float[i * 4 + 1];
    positions[i * 3 + 2] = float[i * 4 + 2];

    const reflectance = Math.min(float[i * 4 + 3], 3);
    colors[i * 4 + 0] = 40 + reflectance * 70;
    colors[i * 4 + 1] = 40 + reflectance * 60;
    colors[i * 4 + 2] = 40 + reflectance * 60;
  }
  return {positions, colors};
}
