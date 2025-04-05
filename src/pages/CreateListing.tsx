
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const listingSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(1000),
  price: z.coerce.number().min(5, { message: "Minimum price is $5" }).max(500, { message: "Maximum price is $500" }),
  category: z.string().min(1, { message: "Please select a category" }),
  deliveryType: z.enum(["instant", "live"], { 
    required_error: "Please select delivery type" 
  }),
  tags: z.string().optional(),
});

const categories = [
  { value: "programming", label: "Programming & Development" },
  { value: "design", label: "Design & Creative" },
  { value: "math", label: "Mathematics & Statistics" },
  { value: "science", label: "Science & Engineering" },
  { value: "language", label: "Languages & Writing" },
  { value: "business", label: "Business & Finance" },
  { value: "other", label: "Other Academic Skills" },
];

const CreateListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);
  const [imageUploaded, setImageUploaded] = useState<File | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 15,
      category: "",
      deliveryType: "instant",
      tags: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof listingSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Creating listing:", values);
      console.log("File:", fileUploaded);
      console.log("Image:", imageUploaded);

      // Mock success for now
      setTimeout(() => {
        toast.success("Listing created successfully!");
        navigate("/dashboard");
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (type === 'file') {
        setFileUploaded(file);
      } else {
        setImageUploaded(file);
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create a Listing</h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge and skills with other students
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Python Data Structures Tutorial & Code Review" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Make it specific and appealing to your target audience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what you're offering in detail..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include what students will learn, your approach, and why you're qualified
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                          <Input 
                            type="number" 
                            className="pl-7" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Set a fair price between $5 and $500
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the most relevant category for your listing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deliveryType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Delivery Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="instant" id="instant" />
                          <Label htmlFor="instant" className="font-normal cursor-pointer">
                            Instant Download (PDF, Code, Video)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="live" id="live" />
                          <Label htmlFor="live" className="font-normal cursor-pointer">
                            Live Session (Tutoring, Code Review)
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      How you'll deliver your knowledge to buyers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., python, algorithms, data-structures" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated keywords to help students find your listing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="listing-file">
                    Upload Listing File {form.watch("deliveryType") === "instant" && "(Required)"}
                  </Label>
                  <div 
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => document.getElementById("listing-file")?.click()}
                  >
                    <input
                      type="file"
                      id="listing-file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'file')}
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {fileUploaded ? fileUploaded.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, ZIP, MP4, or other files up to 100MB
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="listing-image">Upload Listing Image</Label>
                  <div 
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => document.getElementById("listing-image")?.click()}
                  >
                    <input
                      type="file"
                      id="listing-image"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                    />
                    {imageUploaded ? (
                      <img 
                        src={URL.createObjectURL(imageUploaded)} 
                        alt="Preview" 
                        className="max-h-48 mx-auto object-contain" 
                      />
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload an image to represent your listing
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Listing..." : "Create Listing"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateListing;
