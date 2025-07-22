import { useState, useEffect } from 'react';
import { profilesService } from '../lib/database';
import { onboardingQuestions } from '../app/page';
import { supabase } from '../lib/supabase';

export default function Onboarding({ user, profile, onComplete }) {
  const [form, setForm] = useState({
    name: profile?.name || '',
    isLooking: profile?.isLooking === false ? 'vc' : 'founder',
    history: profile?.history || '',
    lookingfor: profile?.lookingfor || '',
    link: profile?.link || '',
    vcphotourl: profile?.vcphotourl || '',
    error: '',
    loading: false,
  });
  const [profilePicFile, setProfilePicFile] = useState(null);

  const handleChange = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicFile(file);
    handleChange('vcphotourl', file ? file.name : '');
  };

  async function uploadProfilePic(file) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const filePath = `vc-profile-pics/${user.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('profile-pics').upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('profile-pics').getPublicUrl(filePath);
    return data.publicUrl;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm(f => ({ ...f, error: '', loading: true }));
    if (!form.name || !form.isLooking || !form.history || !form.lookingfor || !form.link) {
      setForm(f => ({ ...f, error: 'Please fill out all fields.', loading: false }));
      return;
    }
    let profilePicUrl = form.vcphotourl;
    if (form.isLooking === 'vc') {
      if (!profilePicFile && !form.vcphotourl) {
        setForm(f => ({ ...f, error: 'VCs must upload a profile picture.', loading: false }));
        return;
      }
      if (profilePicFile) {
        try {
          profilePicUrl = await uploadProfilePic(profilePicFile);
        } catch (err) {
          setForm(f => ({ ...f, error: 'Failed to upload profile picture.', loading: false }));
          return;
        }
      }
      if (!profilePicUrl) {
        setForm(f => ({ ...f, error: 'Failed to get profile picture URL.', loading: false }));
        return;
      }
    }
    try {
      await profilesService.upsertProfile({
        id: user.id,
        name: form.name,
        isLooking: form.isLooking === 'founder',
        history: form.history,
        lookingfor: form.lookingfor,
        link: form.link,
        vcphotourl: form.isLooking === 'vc' ? profilePicUrl : null,
      });
      onComplete();
    } catch (err) {
      setForm(f => ({ ...f, error: 'Failed to save profile. Please try again.', loading: false }));
    }
  };

  useEffect(() => {
    if (showOnboarding) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          // You might want to prevent closing onboarding with escape
          // Or add a way to close it
        }
      }

      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showOnboarding])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome! Let&apos;s set up your profile</h2>
        {onboardingQuestions.map(q => (
          <div key={q.key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{q.label}</label>
            {q.key === 'isLooking' ? (
              <select
                value={form.isLooking}
                onChange={e => handleChange('isLooking', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="founder">Founder</option>
                <option value="vc">VC</option>
              </select>
            ) : (
              <input
                type={q.type || 'text'}
                value={form[q.key] || ''}
                onChange={e => handleChange(q.key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                maxLength={q.key === 'lookingfor' ? 69 : undefined}
                required
              />
            )}
          </div>
        ))}
        {/* VC profile picture upload */}
        {form.isLooking === 'vc' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Upload a profile picture (required for VCs)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required={!form.vcphotourl}
            />
            {form.vcphotourl && (
              <p className="text-xs text-gray-600 mt-1">Selected: {form.vcphotourl}</p>
            )}
          </div>
        )}
        {form.error && <div className="text-red-600 text-sm">{form.error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={form.loading}
        >
          {form.loading ? 'Saving...' : 'Finish Onboarding'}
        </button>
      </form>
    </div>
  );
} 