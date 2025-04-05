
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { Tag, X, Upload, File, Image, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  price: z.coerce.number().min(1, { message: "Price must be at least $1" }),
  deliveryType: z.enum(["instant", "live"]),
  tags: z.array(z.string()).min(1, { message: "Add at least one tag" }).max(5, { message: "You can add up to 5 tags" }),
});

const CreateListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      deliveryType: "instant",
      tags: [],
    },
  });

  const addTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim()) && tags.length < 5) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const storageRef = ref(storage, `files/${currentUser?.uid}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload file");
          setUploadingFile(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFileURL(downloadURL);
          setFileName(file.name);
          setUploadingFile(false);
          toast.success("File uploaded successfully");
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      setUploadingFile(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `images/${currentUser?.uid}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image");
          setUploadingImage(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageURL(downloadURL);
          setUploadingImage(false);
          toast.success("Image uploaded successfully");
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      toast.error("You must be logged in to create a listing");
      return;
    }

    if (values.deliveryType === "instant" && !fileURL) {
      toast.error("You must upload a file for instant delivery listings");
      return;
    }

    setIsSubmitting(true);
    try {
      const listingData = {
        title: values.title,
        description: values.description,
        price: values.price,
        deliveryType: values.deliveryType,
        tags: values.tags,
        fileURL: fileURL || null,
        imageURL: imageURL || null,
        sellerId: currentUser.uid,
        sellerName: currentUser.displayName,
        sellerPhotoURL: currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        averageRating: 0,
        reviewCount: 0,
      };

      const docRef = await addDoc(collection(db, "listings"), listingData);
      toast.success("Listing created successfully!");
      navigate(`/listings/${docRef.id}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create a New Listing</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Advanced React Hooks Tutorial" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, specific title will attract more buyers.
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
                        placeholder="Describe your service or product in detail..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include what buyers will learn or receive, your expertise, and any other relevant details.
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
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Set a competitive price for your service.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instant">Instant Download</SelectItem>
                          <SelectItem value="live">Live Session</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value === "instant" 
                          ? "Buyers will receive downloadable content immediately after purchase." 
                          : "You'll schedule a live session with buyers after purchase."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <div 
                          key={tag} 
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <span>{tag}</span>
                          <button 
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add a tag (e.g., react, javascript)"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={addTag}
                        disabled={tags.length >= 5}
                      >
                        <Tag size={16} className="mr-2" /> Add
                      </Button>
                    </div>
                    <FormDescription>
                      Add up to 5 tags to help buyers find your listing.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="file">
                    {form.watch("deliveryType") === "instant" ? "Upload File (Required)" : "Upload File (Optional)"}
                  </Label>
                  <div className="mt-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors text-center"
                    >
                      {fileURL ? (
                        <div className="flex items-center justify-center gap-2">
                          <File size={24} className="text-primary" />
                          <span className="font-medium">{fileName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFileURL(null);
                              setFileName(null);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ) : uploadingFile ? (
                        <div className="flex flex-col items-center">
                          <Loader2 size={24} className="animate-spin text-primary mb-2" />
                          <span>Uploading file...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-gray-500">Click to upload a file</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Upload Image (Optional)</Label>
                  <div className="mt-2">
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors text-center"
                    >
                      {imageURL ? (
                        <div className="relative">
                          <img
                            src={imageURL}
                            alt="Listing preview"
                            className="h-32 mx-auto object-contain"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="absolute top-0 right-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageURL(null);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ) : uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <Loader2 size={24} className="animate-spin text-primary mb-2" />
                          <span>Uploading image...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Image size={24} className="text-gray-400 mb-2" />
                          <span className="text-gray-500">Click to upload an image</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={imageInputRef}
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || uploadingFile || uploadingImage}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Listing</>
                  ) : (
                    "Create Listing"
                  )}
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
