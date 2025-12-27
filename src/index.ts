// Copyright 2025 Hēsperus
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the LGPLicense.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export { default as BaseModule } from '@/baseModule';
export type { Coordinates, Options, Pointer, Pointers, StdEvents } from '@/declarations';
export { default as Click } from '@/modules/click';
export { default as Drag } from '@/modules/drag';
export { default as MultitouchPanZoom } from '@/modules/multitouchPanZoom';
export { default as PreventDefault } from '@/modules/preventDefault';
export { default as WheelPanZoom } from '@/modules/wheelPanZoom';
export { default as Pointeract } from '@/pointeract';
