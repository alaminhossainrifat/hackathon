import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

export interface PreviewFeature {
  icon: string;
  title: string;
  tagline: string;
  category: 'Community & Govt' | 'Farmer Panel';
  status: string;
  points: { title?: string; desc: string }[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  // Existing features list
  features = [
    { icon: '🚨', title: 'Disaster Alerts', desc: 'Real-time disaster warnings', route: '/disasters', guest: true },
    { icon: '🗺️', title: 'Live Map', desc: 'Interactive disaster map', route: '/map', guest: true },
    { icon: '🏠', title: 'Safe Zones', desc: 'Find nearest shelter', route: '/safezones', guest: true },
    { icon: '🤖', title: 'ResQBot AI', desc: 'AI disaster assistant', route: '/resqbot', guest: true },
    { icon: '🆘', title: 'SOS Alert', desc: 'Emergency SOS button', route: '/sos', guest: false },
    { icon: '🚑', title: 'Ambulance', desc: 'Find nearest ambulance', route: '/ambulances', guest: false },
    { icon: '👨‍⚕️', title: 'Doctors', desc: 'Connect with doctors', route: '/doctors', guest: false },
    { icon: '🩸', title: 'Blood Bank', desc: 'Find blood donors', route: '/blood-bank', guest: false },
    { icon: '🔍', title: 'Missing Persons', desc: 'Report missing people', route: '/missing-persons', guest: false },
    { icon: '🏙️', title: 'Civic Reports', desc: 'Report city issues', route: '/civic-reports', guest: false },
  ];

  // Community & Govt features (14 - 17)
  communityGovFeatures: PreviewFeature[] = [
    {
      icon: '📰',
      title: 'ResQNet Feed',
      tagline: 'কমিউনিটি-ভেরিফাইড ইনফো ফিড',
      category: 'Community & Govt',
      status: 'Coming Soon',
      points: [
        { title: 'Media Upload & Post Creation', desc: 'ছবি/ভিডিও + ক্যাপশন + GPS লোকেশন + ক্যাটাগরি ট্যাগ (NO_ELECTRICITY, NO_GAS, FLOOD ইত্যাদি)' },
        { title: 'AI Authenticity Check', desc: 'AI দিয়ে fake/real যাচাই (metadata, context mismatch detection)' },
        { title: 'Community Verification Loop', desc: 'লোকাল ইউজার Real/Fake ভোট দিবে; থ্রেশহোল্ড পার হলে auto-remove বা Verified badge' },
        { title: 'Public Feed Page', desc: 'এলাকাভিত্তিক ফিল্টার, লাইভ ম্যাপের সাথে ইন্টিগ্রেশন' }
      ]
    },
    {
      icon: '✅',
      title: 'Verified Organization Badge',
      tagline: 'অথেনটিক এনজিও ও সরকারি সংস্থা ভেরিফিকেশন',
      category: 'Community & Govt',
      status: 'Coming Soon',
      points: [
        { desc: 'NGO/সরকারি সংস্থাকে verified badge — তাদের পোস্ট বেশি বিশ্বস্ত হিসেবে চিহ্নিত হবে (Fake info সমস্যা কমাবে)' }
      ]
    },
    {
      icon: '📊',
      title: 'Disaster Prediction Dashboard',
      tagline: 'Govt & NGO Level প্রিভেন্টিভ টুল',
      category: 'Community & Govt',
      status: 'Coming Soon',
      points: [
        { desc: 'হিস্টোরিক্যাল ডেটা + Weather API দিয়ে ঝুঁকিপূর্ণ এলাকার heatmap' },
        { desc: 'প্রশাসনের আগাম প্রস্তুতির জন্য ব্যবহৃত হবে' }
      ]
    },
    {
      icon: '📄',
      title: 'Post-Disaster Damage Assessment Report',
      tagline: 'স্বয়ংক্রিয় ক্ষয়ক্ষতি নিরূপণ ও রিপোর্টিং',
      category: 'Community & Govt',
      status: 'Coming Soon',
      points: [
        { desc: 'ইউজার-রিপোর্টেড ড্যামেজ ডেটা অ্যাগ্রিগেট করে PDF সামারি রিপোর্ট জেনারেট' },
        { desc: 'সরকার/NGO এর পুনর্বাসন পরিকল্পনায় ব্যবহারযোগ্য' }
      ]
    }
  ];

  // Farmer Panel features (18 - 19)
  farmerFeatures: PreviewFeature[] = [
    {
      icon: '🌾',
      title: 'AI Crop Prediction',
      tagline: 'কৃষি ঝুঁকি ও ফলন সুরক্ষা পূর্বাভাস',
      category: 'Farmer Panel',
      status: 'Coming Soon',
      points: [
        { title: 'Input Parameters', desc: 'মাটির ধরন (soil type), ফসলের ধরন, বপনের তারিখ, এলাকা' },
        { title: 'Analytics & Recommendation', desc: 'Weather API + soil data মিলিয়ে ঝুঁকি স্কোর ও সুপারিশ প্রদান' }
      ]
    },
    {
      icon: '⚠️',
      title: 'Smart Alert System',
      tagline: 'কৃষকদের জন্য সময়োপযোগী আগাম সতর্কবার্তা',
      category: 'Farmer Panel',
      status: 'Coming Soon',
      points: [
        { title: 'Harvest Threshold Alert', desc: 'বন্যার পূর্বাভাসে ফসল ৫০%+ পাকলে তাৎক্ষণিক "এখনই কাটুন" অ্যালার্ট' },
        { title: '5-7 Day Weather Advisory', desc: 'আগামী সপ্তাহের বৃষ্টি/ঝড়ের পূর্বাভাসভিত্তিক পরামর্শ' }
      ]
    }
  ];

  // Modal State Management
  selectedFeature: PreviewFeature | null = null;

  openFeatureModal(feature: PreviewFeature) {
    this.selectedFeature = feature;
    document.body.style.overflow = 'hidden';
  }

  closeFeatureModal() {
    this.selectedFeature = null;
    document.body.style.overflow = 'auto';
  }
}