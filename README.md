# Internee.pk LMS Mobile App

This React Native app was developed as part of my Internee.pk React Native Internship Assignment 3.

## Overview

The app is a Learning Management System mobile application for interns. It allows users to browse courses, view course details, track progress, and download course materials for offline access.

## Features

- Browse available courses
- View course details
- Track course progress
- Mark lessons as completed
- Download course materials
- Access downloaded materials offline
- Save progress locally

## Technologies Used

- React Native
- Expo
- React Navigation
- AsyncStorage
- Expo FileSystem

## Purpose

The purpose of this app is to provide interns with a smooth mobile learning experience where they can manage their courses and track their learning progress.

## Run locally

With Node.js and npm installed, run from the repository root:

```bash
npm install
npm start
```

Use an Android emulator or a compatible Expo Go device.

## Data and limitations

This is an internship LMS prototype with bundled course descriptions and lesson titles. Completion is self-reported with a button and saved in AsyncStorage; it does not assess learning. Material downloads write bundled text to local files for offline reading, rather than fetching a hosted course library. No accounts, hosted LMS or cross-device synchronization are implemented. Device/offline behavior was not run during this documentation review.
