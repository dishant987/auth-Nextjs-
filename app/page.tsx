"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  LockIcon,
  ShieldIcon,
  KeyIcon,
  UserIcon,
  EyeIcon,
  RefreshCcwIcon,
  ZapIcon,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const [securityLevel, setSecurityLevel] = React.useState(98);
  const [encryptionStrength, setEncryptionStrength] = React.useState(85);
  const [userSatisfaction, setUserSatisfaction] = React.useState(95);

  const handleSliderChange = (
    value: number[],
    setValue: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setValue(value[0]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-blue-200 to-gray-400 p-4">
      <div className="w-full max-w-lg space-y-8 rounded-xl bg-white p-6 text-center shadow-xl sm:p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome Back
          </h1>
          <p className="text-gray-600">Our Auth Services</p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xs mx-auto"
        >
          <CarouselContent>
            {[
              {
                icon: ShieldIcon,
                title: "Security",
                description: "Top-notch protection",
              },
              {
                icon: KeyIcon,
                title: "Encryption",
                description: "256-bit encryption",
              },
              {
                icon: UserIcon,
                title: "User-Friendly",
                description: "Easy to use",
              },
              {
                icon: EyeIcon,
                title: "Privacy",
                description: "Your data is safe",
              },
              {
                icon: RefreshCcwIcon,
                title: "Multi-Factor",
                description: "Extra layer of security",
              },
              {
                icon: ZapIcon,
                title: "Fast",
                description: "Quick authentication",
              },
            ].map((item, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <item.icon className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="space-y-6">
          {/* Security Level Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <ShieldIcon className="w-4 h-4 mr-2" />
                Security Level
              </label>
              <span className="text-sm text-gray-500">{securityLevel}%</span>
            </div>
            <Slider
              value={[securityLevel]}
              max={100}
              step={1}
              onValueChange={(value) =>
                handleSliderChange(value, setSecurityLevel)
              }
            />
          </div>

          {/* Encryption Strength Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <KeyIcon className="w-4 h-4 mr-2" />
                Encryption Strength
              </label>
              <span className="text-sm text-gray-500">
                {encryptionStrength}%
              </span>
            </div>
            <Slider
              value={[encryptionStrength]}
              max={100}
              step={1}
              onValueChange={(value) =>
                handleSliderChange(value, setEncryptionStrength)
              }
            />
          </div>

          {/* User Satisfaction Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                User Satisfaction
              </label>
              <span className="text-sm text-gray-500">{userSatisfaction}%</span>
            </div>
            <Slider
              value={[userSatisfaction]}
              max={100}
              step={1}
              onValueChange={(value) =>
                handleSliderChange(value, setUserSatisfaction)
              }
            />
          </div>
        </div>

        <Button className="w-full text-lg" size="lg">
          <LockIcon className="mr-2 h-5 w-5" />
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
